pipeline {
    agent none

    stages {
        stage("build and deploy on Windows and Linux") {
                stage("linux") {
                    agent {
                        label "linux"
                    }
                    stages {
                        stage("build") {
                            steps {
                                sh "./run-build.sh"
                            }
                        }
                        stage("deploy") {
                             when {
                                 branch "master"
                             }
                             steps {
                                sh "./run-deploy.sh"
                            }
                        }
                }
            }
        }
    }
}
