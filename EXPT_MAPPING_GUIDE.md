# 🎓 Lab Experiments Mapping Guide (Expt 1 to Expt 9)
### Course: Agile Software Development & DevOps Lab
**Project Title:** College Canteen Queue & Crowd Tracker  
**Team Members:** Krish (Lead/DevOps), Trish (Backend/DB), Tanay (Frontend/UI)  

This document provides a **1-to-1 mapping** proving how this single project satisfies every single experiment listed in your lab syllabus.

---

## 📑 Syllabus Experiments Matrix

| Experiment No. | Topic in Syllabus | How Implemented in This Project | Reference Files in Repo |
|---|---|---|---|
| **Expt No. 1** | **Version Control Operations using Git** | Multi-branch workflow (`main`, `develop`, feature branches for Krish, Trish & Tanay), Jira commit conventions (`CAN-101:`), and semantic release tagging (`v1.0.0`). | `GIT_TEAM_WORKFLOW.md`, `init-team-git.ps1` |
| **Expt No. 2** | **To Containerize Application using Docker** | Isolated Docker images for Python Flask backend (with healthcheck & curl) and React/Nginx frontend (multi-stage build). | `backend/Dockerfile`, `frontend/Dockerfile` |
| **Expt No. 3** | **To deploy multi-service applications using Docker Compose** | Multi-container stack orchestrating 5 interconnected services: Backend, Frontend, PostgreSQL, Prometheus, and Grafana on an isolated bridge network with volumes. | `docker-compose.yml` |
| **Expt No. 4** | **Jenkins** | Automated pipeline setup using Jenkins agent, environment variables, credentials, and stage definitions. | `Jenkinsfile` |
| **Expt No. 5** | **To automate application deployment using Github/ Jenkins** | End-to-end CI/CD pipeline triggered by GitHub pushes: automated checkout, syntax linting, pytest execution, docker container builds, container health verification, and deployment. | `Jenkinsfile`, `backend/tests/test_api.py` |
| **Expt No. 6** | **Jira** | Complete Agile Scrum backlog with Epics (CAN-E1 to CAN-E5), Sprints (Sprint 1 to 3), User Stories with acceptance criteria, story points estimation, and burndown chart setup. | `JIRA_BACKLOG_AND_SPRINTS.md` |
| **Expt No. 7** | **To implement monitoring using Prometheus / Grafana / Nagios** | Python `prometheus_client` exporter on `/metrics` tracking `http_requests_total`, `canteen_crowd_level`, `canteen_active_orders`, and `canteen_estimated_wait_minutes`. Automated Prometheus scraper and pre-provisioned Grafana dashboard. | `backend/metrics.py`, `monitoring/prometheus.yml`, `monitoring/grafana/` |
| **Expt No. 8** | **CI/CD Pipeline to host a website on AWS** | Deployment scripts and pipeline configurations for deploying containerized Canteen website onto an AWS EC2 Ubuntu instance with port mappings and public access. | `terraform/main.tf`, `Jenkinsfile` (Stage 7/8) |
| **Expt No. 9** | **To provision cloud infrastructure using Terraform** | HashiCorp Terraform configuration (`main.tf`, `variables.tf`) declaring AWS Security Groups (ports 80, 5000, 9090, 3001), AMI lookup, EC2 instance, and user data bootstrap script. | `terraform/main.tf`, `terraform/variables.tf` |

---

## 🔍 Detailed Evidence & Defense for Each Experiment

### 1. Expt 1: Git Version Control
- **Concept Demonstrated:** Branching strategies, distributed collaboration, conflict-free merges, and commit traceability.
- **In Our Project:** Feature branches `feature/CAN-102-backend-api` (Trish), `feature/CAN-103-frontend-ui` (Tanay), and `feature/CAN-105-devops-pipeline` (Krish). All merged via Pull Requests with `--no-ff` into `develop`, and released to `main` with tag `v1.0.0`.

### 2. Expt 2: Docker Containerization
- **Concept Demonstrated:** Immutable application packaging, dependency isolation, minimal attack surface.
- **In Our Project:** 
  - Backend uses `python:3.11-slim`, non-root user conventions, curl health check.
  - Frontend uses a multi-stage Docker build (`node:20-alpine` builds assets -> `nginx:alpine` serves static files), reducing image size by over 80%.

### 3. Expt 3: Docker Compose Multi-Service Architecture
- **Concept Demonstrated:** Inter-container service discovery, shared networks, persistent volume management, container startup dependency order (`depends_on` with healthcheck conditions).
- **In Our Project:** 5 services running together on `canteen-network`:
  1. `postgres:15-alpine` (database storage with `postgres_data` volume)
  2. `backend` (Flask API on port 5000, waits for postgres to be healthy)
  3. `frontend` (Nginx on port 3000 -> 80, reverse proxies `/api` to backend)
  4. `prometheus` (metrics scraper on port 9090)
  5. `grafana` (dashboard visualization on port 3001)

### 4. Expt 4 & 5: Jenkins CI/CD Automation
- **Concept Demonstrated:** Declarative pipelines, automated unit testing gates, ephemeral container smoke testing, continuous deployment.
- **In Our Project:** The `Jenkinsfile` runs:
  - Stage 1: Checkout from GitHub
  - Stage 2: Code Lint & Syntax check (`py_compile`)
  - Stage 3: Pytest automated tests (`backend/tests/test_api.py`)
  - Stage 4: Frontend asset build (`npm run build`)
  - Stage 5: Docker image building (`docker build -t canteen-backend`)
  - Stage 6: Ephemeral container smoke test & `/health` verification
  - Stage 7: Docker compose stack deployment
  - Stage 8: Post-deployment scrape check

### 5. Expt 6: Jira Scrum Project Management
- **Concept Demonstrated:** Product backlog grooming, epic breakdown, sprint planning, story estimation (Fibonacci points), Definition of Done (DoD).
- **In Our Project:** Complete documentation in `JIRA_BACKLOG_AND_SPRINTS.md` ready to present or paste directly into Atlassian Jira Software.

### 6. Expt 7: Monitoring using Prometheus & Grafana
- **Concept Demonstrated:** White-box instrumentation, time-series metrics collection, latency histograms, custom domain gauges, automated dashboard provisioning.
- **In Our Project:**
  - Metrics endpoint: `http://localhost:5000/metrics`
  - Custom Gauges: `canteen_crowd_level` (1 to 4), `canteen_active_orders`, `canteen_estimated_wait_minutes`
  - Counters: `http_requests_total`, `canteen_order_revenue_total`
  - Grafana dashboard: Auto-loads on startup with live Gauges and traffic rate graphs.

### 7. Expt 8 & 9: AWS Hosting & Terraform Infrastructure as Code
- **Concept Demonstrated:** Declarative cloud resource provisioning, state management, automated cloud bootstrapping.
- **In Our Project:** `terraform/main.tf` creates the complete AWS infrastructure required to host the Canteen Tracker:
  - Security Group allowing ports 80 (Web), 5000 (API), 9090 (Prometheus), 3001 (Grafana), 22 (SSH).
  - EC2 instance with user data script installing Docker, Docker Compose, and cloning the project.
