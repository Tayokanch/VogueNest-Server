pipeline {
    agent any
    tools{
        nodejs 'NJ20.19.0'
    }
    stages {
        stage('Checkout Branch'){
            steps{

            sh '''
                echo "checking out to development branch...."
                git checkout ${params.BRANCH}
            '''
            }
        }
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
        sh 'curl -I http://localhost:3100/api/users > response.txt'
        sh """
            if ! grep -q "HTTP/1.1 200" users.txt; then
                curl http://localhost:3100/api/users > users.txt
                exit 1
            fi
        """
        archiveArtifacts artifacts: 'users.txt', fingerprint: true
    }
}


    }
}
