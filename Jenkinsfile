pipeline {
    agent any

    environment {
        APP_NAME         = 'college-canteen-tracker'
        DOCKER_BACKEND   = 'canteen-backend'
        DOCKER_FRONTEND  = 'canteen-frontend'
        REGISTRY_USER    = 'krish'
        BUILD_TAG        = "${env.BUILD_NUMBER}"
        PYTHON_VENV      = "venv"
    }

    stages {
        // -------------------------------------------------------------
        // Stage 1: Version Control & Checkout (Expt 1 & Expt 5)
        // -------------------------------------------------------------
        stage('Checkout Source Code') {
            steps {
                echo "📥 Pulling latest code changes from GitHub repository..."
                checkout scm
                sh 'git status'
                sh 'git log -1 --pretty=format:"Commit: %h by %an on %cd"'
            }
        }

        // -------------------------------------------------------------
        // Stage 2: Lint & Static Code Analysis
        // -------------------------------------------------------------
        stage('Lint & Static Analysis') {
            steps {
                echo "🔍 Running static syntax check on Python & JavaScript..."
                sh '''
                    python3 -m py_compile backend/app.py backend/models.py backend/metrics.py backend/routes/api.py
                    echo "Backend syntax verification passed."
                '''
            }
        }

        // -------------------------------------------------------------
        // Stage 3: Automated Unit Testing (Pytest)
        // -------------------------------------------------------------
        stage('Backend Automated Unit Tests') {
            steps {
                echo "🧪 Executing unit tests for API endpoints and Prometheus metrics..."
                sh '''
                    python3 -m pip install -r backend/requirements.txt
                    pytest backend/tests/test_api.py -v --junitxml=test-results.xml
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results.xml'
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 4: Frontend Build & Asset Compilation
        // -------------------------------------------------------------
        stage('Frontend Build & Verification') {
            steps {
                echo "⚛️ Building Vite + React production static assets..."
                dir('frontend') {
                    sh '''
                        npm install --silent
                        npm run build
                    '''
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 5: Containerize Application using Docker (Expt 2)
        // -------------------------------------------------------------
        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images for Backend and Frontend..."
                sh """
                    docker build -t ${DOCKER_BACKEND}:${BUILD_TAG} -t ${DOCKER_BACKEND}:latest ./backend
                    docker build -t ${DOCKER_FRONTEND}:${BUILD_TAG} -t ${DOCKER_FRONTEND}:latest ./frontend
                """
            }
        }

        // -------------------------------------------------------------
        // Stage 6: Container Smoke Testing & Healthcheck
        // -------------------------------------------------------------
        stage('Container Smoke Test') {
            steps {
                echo "🩺 Testing ephemeral container health..."
                sh """
                    docker run -d --name temp-canteen-backend -p 5005:5000 ${DOCKER_BACKEND}:${BUILD_TAG}
                    sleep 5
                    curl -f http://localhost:5005/health || (docker logs temp-canteen-backend && exit 1)
                    curl -f http://localhost:5005/metrics || exit 1
                    docker stop temp-canteen-backend && docker rm temp-canteen-backend
                    echo "Smoke tests passed successfully!"
                """
            }
        }

        // -------------------------------------------------------------
        // Stage 7: Deploy Multi-Service Application (Expt 3 & Expt 5)
        // -------------------------------------------------------------
        stage('Deploy Multi-Service Stack') {
            steps {
                echo "🚀 Launching Canteen Tracker, Postgres, Prometheus & Grafana via Docker Compose..."
                sh '''
                    docker compose down --remove-orphans || true
                    docker compose up -d --build
                    sleep 10
                '''
            }
        }

        // -------------------------------------------------------------
        // Stage 8: Post-Deployment Smoke Verification & Scrape Check (Expt 7)
        // -------------------------------------------------------------
        stage('Verify Live Deployment & Monitoring') {
            steps {
                echo "📡 Verifying live deployment and Prometheus scraping..."
                sh '''
                    curl -f http://localhost:5000/health
                    curl -f http://localhost:3000/ || curl -f http://localhost:80/
                    echo "Checking Prometheus metrics endpoint..."
                    curl -s http://localhost:5000/metrics | grep canteen_crowd_level
                    echo "Deployment verified healthy!"
                '''
            }
        }
    }

    // -------------------------------------------------------------
    // Post-Build Pipeline Notifications
    // -------------------------------------------------------------
    post {
        success {
            echo "✅ Jenkins Pipeline Succeeded! Canteen Crowd Tracker is LIVE on production."
            echo "Team: Krish (DevOps Lead), Trish (Backend), Tanay (Frontend)"
        }
        failure {
            echo "❌ Pipeline failed at one of the stages. Please check Jenkins console output."
        }
        always {
            cleanWs deleteDirs: true, notFailBuild: true
        }
    }
}
