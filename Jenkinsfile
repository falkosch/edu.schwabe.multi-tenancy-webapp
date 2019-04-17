pipeline {
  agent any
  parameters {
    string(name: 'tenant', defaultValue: '', description: 'Name of a tenant app to build')
  }
  triggers {
    pollSCM('H */15 * * *')
  }
  options {
    skipStagesAfterUnstable()
  }
  stages {
    stage('checkout') {
      steps {
        sh 'npm install'
        sh 'npx lerna bootstrap'
      }
    }
    stage('lint') {
      steps {
        sh 'npx lerna run lint:ci'
      }
    }
    stage('unit tests') {
      steps {
        sh 'npx lerna run test:ci'
        junit '**/test-reports/*.xml'
        cobertura coberturaReportFile: '**/coverage/cobertura.xml',
          conditionalCoverageTargets: '70, 0, 0',
          enableNewApi: true,
          lineCoverageTargets: '80, 0, 0',
          maxNumberOfBuilds: 0,
          methodCoverageTargets: '80, 0, 0',
          onlyStable: false,
          sourceEncoding: 'ASCII'
      }
    }
    stage('build artifact') {
      steps {
        sh 'npx lerna run build:ci'
      }
    }
    stage('generate docs') {
      steps {
        sh 'npx lerna run docs'
      }
    }
  }
  post {
    always {
      deleteDir()
    }
  }
}
