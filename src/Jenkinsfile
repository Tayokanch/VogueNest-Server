pipeline {
    agent any
    tools{
        nodejs 'NJ20.19.0'
    }
    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || true'   
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build '
            }
        }

stage('Health Check') {
    steps {
        sh 'curl -I http://localhost:3100/api/users > users.txt'
        sh '''
            if ! grep -q "HTTP/1.1 200" users.txt; then
                echo "API health check failed"
                exit 1
            fi
        '''
        archiveArtifacts artifacts: 'users.txt', fingerprint: true
    }
}


    }
}
