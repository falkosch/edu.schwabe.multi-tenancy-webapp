pipeline {
  agent {
    docker {
      image 'atlassianlabs/docker-node-jdk-chrome-firefox:2019-12-30'
      label 'docker && linux'
    }
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    preserveStashes(buildCount: 3)
    skipStagesAfterUnstable()
    timeout(time: 4, unit: 'HOURS')
  }

  triggers {
    pollSCM('H */15 * * *')
  }

  environment {
      CI = true
      HOME = "${env.WORKSPACE}"
  }

  stages {
    stage('checkout') {
      steps {
        sh 'npm ci'
        sh 'npm run clean:ci'
      }
    }

    stage('validation') {
      failFast false

      parallel {
        stage('lint') {
          steps {
            script {
              try {
                sh 'npm run lint:ci'
              }
              finally {
                recordIssues(
                  enabledForFailure: true,
                  ignoreFailedBuilds: false,
                  qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]],
                  tools: [checkStyle(pattern: 'reports/*.checkstyle.xml')]
                )
              }
            }
          }
        }

        stage('unit tests') {
          steps {
            script {
              try {
                sh 'npm run test:ci'
              }
              finally {
                junit '**/reports/test-reports/TESTS*.xml'

                cobertura([
                  coberturaReportFile: '**/reports/cobertura-coverage.xml',
                  conditionalCoverageTargets: '80, 0, 0',
                  enableNewApi: true,
                  lineCoverageTargets: '80, 0, 0',
                  maxNumberOfBuilds: 0,
                  methodCoverageTargets: '80, 0, 0',
                  onlyStable: false,
                  sourceEncoding: 'ASCII'
                ])
              }

              if (currentBuild.resultIsWorseOrEqualTo('UNSTABLE')) {
                error('Test stage did not pass')
              }
            }
          }
        }
      }
    }

    stage('sonar quality gate') {
      steps {
        lock(resource: 'sonarcloud-multi-tenancy-webapp') {
          withSonarQubeEnv('sonarqube') {
            withEnv(["sonar.branch.name=${env.BRANCH_NAME}"]) {
                sh 'npm run sonar:ci'
            }
          }

          sleep time: 20, unit: 'SECONDS'

          timeout(time: 1, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }

    stage('generate docs') {
      steps {
        sh 'npm run docs:ci'

        publishHTML([
          alwaysLinkToLastBuild: false,
          allowMissing: false,
          keepAll: true,
          reportDir: 'docs',
          reportFiles: 'index.html',
          reportName: 'TypeDoc Files'
        ])
      }
    }

    stage('deploy') {
      when {
        expression {
          currentBuild.resultIsBetterOrEqualTo('SUCCESS')
        }
      }

      stages {
        stage('Deploy to testing') {
          when {
            changeRequest()
          }

          steps {
            milestone(3)
            sh "node tools/determine-base-URL.js ${BRANCH_NAME}"

            sh 'npm run build:ci'

            archiveArtifacts(artifacts: 'apps/*/deploy/*.zip', fingerprint: true, onlyIfSuccessful: true)

            configFileProvider([configFile(fileId: 'webserver-deploy-config', variable: 'deployConfigFile')]) {
              script {
                deployConfig = readProperties(file: deployConfigFile)
                DEPLOY_DOC_ROOT = deployConfig.DEPLOY_DOC_ROOT
              }
            }

            lock(resource: 'deploy-multi-tenancy-webapp') {
              milestone(11)

              sshPublisher(
                publishers: [
                  sshPublisherDesc(configName: 'Deploy to webserver', verbose: true,
                    sshRetry: [retries: 99, retryDelay: 1000],
                    transfers: [
                      sshTransfer(
                        cleanRemote: true,
                        execCommand: "cd ${DEPLOY_DOC_ROOT}/${BRANCH_NAME}" + ' && for f in *.zip; do unzip \$f -d \${f%.zip}; done',
                        flatten: true,
                        makeEmptyDirs: true,
                        remoteDirectory: "${BRANCH_NAME}",
                        sourceFiles: 'apps/*/deploy/*.zip'
                      )
                    ]
                  )
                ]
              )
            }
          }
        }

        stage('Deploy to staging') {
          when {
            branch 'master'
          }

          steps {
            milestone(23)

            sh "node tools/determine-base-URL.js staging"

            sh 'npm run build:ci'

            archiveArtifacts(artifacts: 'apps/*/deploy/*.zip', fingerprint: true, onlyIfSuccessful: true)

            configFileProvider([configFile(fileId: 'webserver-deploy-config', variable: 'deployConfigFile')]) {
              script {
                deployConfig = readProperties(file: deployConfigFile)
                DEPLOY_DOC_ROOT = deployConfig.DEPLOY_DOC_ROOT
              }
            }

            lock(resource: 'deploy-multi-tenancy-webapp') {
              milestone(31)

              sshPublisher(
                publishers: [
                  sshPublisherDesc(configName: 'Deploy to webserver', verbose: true,
                    sshRetry: [retries: 99, retryDelay: 1000],
                    transfers: [
                      sshTransfer(
                        cleanRemote: true,
                        execCommand: "cd ${DEPLOY_DOC_ROOT}/staging" + ' && for f in *.zip; do unzip \$f -d \${f%.zip}; done',
                        flatten: true,
                        makeEmptyDirs: true,
                        remoteDirectory: "staging",
                        sourceFiles: 'apps/*/deploy/*.zip'
                      )
                    ]
                  )
                ]
              )
            }
          }
        }

        stage('Deploy to production') {
          when {
            beforeInput true
            branch 'master'
          }

          input {
            message 'Deploy to production?'
          }

          steps {
            milestone(43)

            sh "node tools/determine-base-URL.js production"

            sh 'npm run build:ci'

            archiveArtifacts(artifacts: 'apps/*/deploy/*.zip', fingerprint: true, onlyIfSuccessful: true)

            configFileProvider([configFile(fileId: 'webserver-deploy-config', variable: 'deployConfigFile')]) {
              script {
                deployConfig = readProperties(file: deployConfigFile)
                DEPLOY_DOC_ROOT = deployConfig.DEPLOY_DOC_ROOT
              }
            }

            lock(resource: 'deploy-multi-tenancy-webapp') {
              milestone(51)

              sshPublisher(
                publishers: [
                  sshPublisherDesc(configName: 'Deploy to webserver', verbose: true,
                    sshRetry: [retries: 99, retryDelay: 1000],
                    transfers: [
                      sshTransfer(
                        cleanRemote: true,
                        execCommand: "cd ${DEPLOY_DOC_ROOT}/production" + ' && for f in *.zip; do unzip \$f -d \${f%.zip}; done',
                        flatten: true,
                        makeEmptyDirs: true,
                        remoteDirectory: "production",
                        sourceFiles: 'apps/*/deploy/*.zip'
                      )
                    ]
                  )
                ]
              ) // sshPublisher
            } // deploy-multi-tenancy-webapp
          }
        } // Deploy to production
      }
    } // deploy
  }

  post {
    failure {
      script {
        committerEmail = sh(returnStdout: true, script: 'git --no-pager show -s --format=\'%ae\'').trim()
      }

      mail(
        to: "${committerEmail}",
        subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
        body: "Something is wrong with ${env.BUILD_URL}"
      )
    }
  }
}
