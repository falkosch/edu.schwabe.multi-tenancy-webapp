pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    preserveStashes()
    skipStagesAfterUnstable()
    timeout(time: 10, unit: 'MINUTES')
  }
  triggers {
    pollSCM('H */15 * * *')
  }
  stages {
    stage('checkout') {
      steps {
        sh 'npm install'
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
                  coberturaReportFile: '**/reports/coverage/**/cobertura.xml',
                  conditionalCoverageTargets: '70, 0, 0',
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
        script {
          withSonarQubeEnv('sonarqube') {
            withEnv(["sonar.branch.name=${env.BRANCH_NAME}"]) {
              sh 'npm run sonar:ci'
            }
          }
          timeout(time: 10, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
    stage('build') {
      failFast true
      parallel {
        stage('build artifact') {
          steps {
            sh 'npm run build:ci'
          }
        }
        stage('generate docs') {
          steps {
            sh 'npm run docs:ci'
          }
        }
      }
    }
    stage('deploy') {
      when {
        expression {
          currentBuild.resultIsBetterOrEqualTo('SUCCESS')
        }
      }
      stages {
        stage('deploy artifact to change request stage') {
          when {
            changeRequest()
          }
          steps {
            echo 'deploying to change request stage'
          }
        }
        stage('deploy artifact to master stage') {
          when {
            branch 'master'
          }
          steps {
            echo 'deploying to master stage'
          }
        }
        stage('deploy artifact to production stage') {
          when {
            buildingTag()
          }
          steps {
            echo 'deploying to production stage'
          }
        }
      }
    }
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
