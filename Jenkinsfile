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
      nodejs() {
        sh 'npm install'
        sh 'npx lerna bootstrap'
      }
    }
    stage('lint') {
      nodejs() {
        sh 'npx lerna run lint:ci'
      }
    }
    stage('unit tests') {
      nodejs() {
        sh 'npx lerna run test:ci'
      }
    }
    stage('build artifact') {
      nodejs() {
        sh 'npx lerna run build:ci'
      }
    }
    stage('generate docs') {
      nodejs() {
        sh 'npx lerna run docs'
      }
    }
  }
}
