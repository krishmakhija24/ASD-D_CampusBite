# 🐙 Git Team Collaboration Guide: Krish, Trish & Tanay
**Lab Expt No. 1:** Version Control Operations using Git  
**Lab Expt No. 5:** Automate application deployment using GitHub / Jenkins  

This guide provides exact Git commands for your 3-member team to demonstrate professional multi-branch collaboration with Jira issue keys.

---

## 👥 Team Roles & Responsibilities

| Teammate | Role | Git Branch | Jira Key Assigned |
|---|---|---|---|
| **Krish** | DevOps & Team Lead | `main`, `develop`, `feature/CAN-105-devops` | `CAN-105`, `CAN-111`, `CAN-113`, `CAN-114` |
| **Trish** | Backend & DB Engineer | `feature/CAN-102-backend-api` | `CAN-101`, `CAN-102`, `CAN-107`, `CAN-112` |
| **Tanay** | Frontend & UI Engineer | `feature/CAN-103-frontend-ui` | `CAN-103`, `CAN-104`, `CAN-108`, `CAN-109` |

---

## 🚀 Step 1: Krish Initializes Repository & Main Branch

```bash
# 1. Initialize Git in the project directory
cd college-canteen-tracker
git init

# 2. Configure Krish's identity
git config user.name "Krish"
git config user.email "krish@college.edu"

# 3. Create initial commit
git add .gitignore README.md EXPT_MAPPING_GUIDE.md JIRA_BACKLOG_AND_SPRINTS.md
git commit -m "CAN-100: Initial project scaffold and documentation"

# 4. Set main branch and create develop branch
git branch -M main
git checkout -b develop

# 5. Connect to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/Krish/college-canteen-tracker.git
git push -u origin main
git push -u origin develop
```

---

## 🐍 Step 2: Trish Implements Backend, DB & Prometheus

```bash
# 1. Trish switches to develop and creates feature branch
git checkout develop
git checkout -b feature/CAN-102-backend-api

# 2. Set Trish's author identity
git config user.name "Trish"
git config user.email "trish@college.edu"

# 3. Stage backend files
git add backend/

# 4. Commit with Jira tags
git commit -m "CAN-101: Implement SQLite/Postgres models for Menu and Orders"
git commit -m "CAN-102: Add Flask REST API endpoints for crowd status and pre-orders"
git commit -m "CAN-107: Instrument Prometheus metrics and request latency middleware"

# 5. Push Trish's branch to GitHub
git push -u origin feature/CAN-102-backend-api
```

---

## ⚛️ Step 3: Tanay Implements Frontend React UI

```bash
# 1. Tanay switches to develop and creates feature branch
git checkout develop
git checkout -b feature/CAN-103-frontend-ui

# 2. Set Tanay's author identity
git config user.name "Tanay"
git config user.email "tanay@college.edu"

# 3. Stage frontend files
git add frontend/

# 4. Commit with Jira tags
git commit -m "CAN-103: Create React Live Crowd Meter with capacity progress bar"
git commit -m "CAN-104: Implement live menu catalog and pre-order cart drawer"
git commit -m "CAN-108: Add live token tracker and kitchen timeline stepper"
git commit -m "CAN-109: Build vendor admin dashboard for status and stock management"

# 5. Push Tanay's branch to GitHub
git push -u origin feature/CAN-103-frontend-ui
```

---

## 🐳 Step 4: Krish Implements Docker, Monitoring & CI/CD Pipeline

```bash
# 1. Krish creates DevOps branch
git checkout develop
git checkout -b feature/CAN-105-devops-pipeline

# 2. Set Krish's author identity
git config user.name "Krish"
git config user.email "krish@college.edu"

# 3. Stage Docker, Jenkins, Monitoring & Terraform files
git add docker-compose.yml Jenkinsfile monitoring/ terraform/

# 4. Commit with Jira tags
git commit -m "CAN-105: Multi-stage Dockerfiles and docker-compose stack"
git commit -m "CAN-110: Configure Prometheus scraping and Grafana dashboard provisioning"
git commit -m "CAN-113: Declarative Jenkinsfile for CI/CD automated build and testing"
git commit -m "CAN-114: Terraform IaC configuration for AWS EC2 cloud host"

# 5. Push to GitHub
git push -u origin feature/CAN-105-devops-pipeline
```

---

## 🔀 Step 5: Merge Pull Requests & Release v1.0.0

```bash
# 1. Switch back to develop and merge all features
git checkout develop
git merge --no-ff feature/CAN-102-backend-api -m "Merge branch 'feature/CAN-102-backend-api' into develop (Trish)"
git merge --no-ff feature/CAN-103-frontend-ui -m "Merge branch 'feature/CAN-103-frontend-ui' into develop (Tanay)"
git merge --no-ff feature/CAN-105-devops-pipeline -m "Merge branch 'feature/CAN-105-devops-pipeline' into develop (Krish)"

# 2. Merge develop into production main branch
git checkout main
git merge --no-ff develop -m "Release v1.0.0: Fully functional College Canteen Crowd & Queue Tracker"

# 3. Tag release for Jenkins CI/CD trigger
git tag -a v1.0.0 -m "Release version 1.0.0 for lab demonstration"

# 4. Push all branches and tags
git push origin main develop --tags
```

---

## ⚡ Quick 1-Click Script to Generate Team Git History
Want the git log to already show commits by **Krish**, **Trish**, and **Tanay** right away?  
Run this script inside the project folder:

```powershell
.\init-team-git.ps1
```
*(This script initializes git, creates `develop` and `main` branches, and makes distinct commits with Krish, Trish, and Tanay as authors!)*
