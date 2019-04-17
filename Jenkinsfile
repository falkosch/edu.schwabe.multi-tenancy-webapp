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
        junit './**/test-reports/*.xml'
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
