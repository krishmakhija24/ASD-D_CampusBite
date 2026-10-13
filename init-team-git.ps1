# =============================================================================
# Automated Git History Initializer for Krish, Trish & Tanay
# Sets up realistic branches, Jira commit messages, and author attributions
# =============================================================================

Write-Host "🚀 Initializing Git repository for College Canteen Tracker..." -ForegroundColor Cyan

git init
git branch -M main

# 1. Base Setup by Krish
git config user.name "Krish"
git config user.email "krish@college.edu"
git add .gitignore README.md EXPT_MAPPING_GUIDE.md JIRA_BACKLOG_AND_SPRINTS.md GIT_TEAM_WORKFLOW.md
git commit -m "CAN-100: Initial project architecture and lab experiment mapping"

# 2. Develop branch
git checkout -b develop

# 3. Backend Commits by Trish
git checkout -b feature/CAN-102-backend-api
git config user.name "Trish"
git config user.email "trish@college.edu"
git add backend/
git commit -m "CAN-101: Implement SQLite and PostgreSQL models for Menu and Orders"
git commit -m "CAN-102: Add Flask REST API endpoints for crowd tracking, orders and admin"
git commit -m "CAN-107: Instrument Prometheus metrics and request latency middleware"

# 4. Merge Trish's work into develop
git checkout develop
git merge --no-ff feature/CAN-102-backend-api -m "Merge PR #1 from Trish: CAN-102 Backend API & Database"

# 5. Frontend Commits by Tanay
git checkout -b feature/CAN-103-frontend-ui
git config user.name "Tanay"
git config user.email "tanay@college.edu"
git add frontend/
git commit -m "CAN-103: Create React Live Crowd Meter with visual queue capacity gauge"
git commit -m "CAN-104: Implement live menu catalog and pre-order cart drawer"
git commit -m "CAN-108: Add live token tracker and kitchen timeline stepper"
git commit -m "CAN-109: Build vendor admin dashboard for status and stock management"

# 6. Merge Tanay's work into develop
git checkout develop
git merge --no-ff feature/CAN-103-frontend-ui -m "Merge PR #2 from Tanay: CAN-103 React UI & Order System"

# 7. DevOps & CI/CD Commits by Krish
git checkout -b feature/CAN-105-devops-pipeline
git config user.name "Krish"
git config user.email "krish@college.edu"
git add docker-compose.yml Jenkinsfile monitoring/ terraform/
git commit -m "CAN-105: Multi-stage Dockerfiles and multi-service docker-compose stack"
git commit -m "CAN-110: Configure Prometheus scraping and Grafana dashboard provisioning"
git commit -m "CAN-113: Declarative Jenkinsfile for CI/CD automated build and testing"
git commit -m "CAN-114: Terraform IaC configuration for AWS EC2 cloud host"

# 8. Merge DevOps work into develop
git checkout develop
git merge --no-ff feature/CAN-105-devops-pipeline -m "Merge PR #3 from Krish: CAN-105 Docker, Jenkins CI/CD & Monitoring"

# 9. Release to main
git checkout main
git merge --no-ff develop -m "Release v1.0.0: Fullstack College Canteen Queue & Crowd Tracker"
git tag -a v1.0.0 -m "Release version 1.0.0 for lab demonstration"

Write-Host "✅ Git history initialized successfully!" -ForegroundColor Green
Write-Host "Run 'git log --graph --oneline --all' to inspect your team commits." -ForegroundColor Yellow
