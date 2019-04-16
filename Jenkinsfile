pipeline {
  agent {
    docker {
      image 'atlassianlabs/docker-node-jdk-chrome-firefox:latest'
    }
  }
  parameters {
    string(name: 'tenant', defaultValue: '', description: 'Name of a tenant app to build')
  }
  stages {
    stage('checkout') {
      steps {
        nodejs() {
          sh 'npm install'
          sh 'npx lerna bootstrap'
        }
      }
    }
    stage('lint') {
      steps {
        nodejs() {
          sh 'npx lerna run lint:ci'
        }
      }
    }
    stage('unit tests') {
      steps {
        nodejs() {
          sh 'npx lerna run test:ci'
        }
      }
    }
    stage('build artifact') {
      steps {
        nodejs() {
          sh 'npx lerna run build:ci'
        }
      }
    }
    stage('generate docs') {
      steps {
        nodejs() {
          sh 'npx lerna run docs'
        }
      }
    }
  }
}
