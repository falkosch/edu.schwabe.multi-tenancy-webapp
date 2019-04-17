pipeline {
  //agent any
  agent {
    docker 'atlassianlabs/docker-node-jdk-chrome-firefox:latest'
  }
  parameters {
    string(name: 'tenant', defaultValue: '', description: 'Name of a tenant app to build')
  }
  tools {
    docker 'latest'
  }
  triggers {
    pollSCM('H */15 * * *')
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
}
