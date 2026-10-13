# 📋 Jira Agile Project Board: College Canteen Queue & Crowd Tracker
**Subject / Lab:** DevOps & Agile Software Development (Expt No. 6: Jira)  
**Project Key:** `CAN`  
**Team Members:**  
- **Krish (Lead / DevOps Engineer):** CI/CD, Docker, Prometheus, Grafana, Terraform  
- **Trish (Backend & Database Engineer):** Flask REST API, PostgreSQL, Prometheus Instrumentation  
- **Tanay (Frontend & UI Engineer):** React/Vite, Queue Visualization, Pre-order Checkout  

---

## 🏛️ Epics

| Epic Key | Epic Summary | Owner | Status |
|---|---|---|---|
| **CAN-E1** | Multi-Tier Core Architecture & Database | Trish | Done |
| **CAN-E2** | Responsive Real-time Student & Admin UI | Tanay | Done |
| **CAN-E3** | Containerization & Multi-Service Orchestration | Krish | Done |
| **CAN-E4** | Observability, Metrics & Telemetry | Krish / Trish | Done |
| **CAN-E5** | Automated CI/CD Pipeline & Cloud Deployment | Krish | In Progress / Done |

---

## 🏃 Sprint Breakdown

### 🎯 Sprint 1: Architecture Inception & Containerization
**Sprint Goal:** Build the functional Flask API, database models, React UI skeleton, and Dockerize services.

| Issue Key | Type | Summary | Assignee | Story Points | Status |
|---|---|---|---|---|---|
| **CAN-101** | Story | Setup SQLite / PostgreSQL schema for Menu Items and Orders | Trish | 5 | Done |
| **CAN-102** | Story | Build Flask REST endpoints for `/api/crowd`, `/api/menu`, `/api/orders` | Trish | 5 | Done |
| **CAN-103** | Story | Design React Live Crowd Meter with visual queue capacity gauge | Tanay | 5 | Done |
| **CAN-104** | Story | Build Live Menu catalog with dietary filters and snack cart | Tanay | 5 | Done |
| **CAN-105** | Task | Author Backend `Dockerfile` and Frontend `Dockerfile` (Multi-stage) | Krish | 3 | Done |
| **CAN-106** | Task | Create `docker-compose.yml` linking Backend, Frontend, and PostgreSQL | Krish | 5 | Done |

---

### 🎯 Sprint 2: Observability & Agile Testing
**Sprint Goal:** Instrument real-time Prometheus metrics, configure Grafana dashboards, and build automated pytest test suite.

| Issue Key | Type | Summary | Assignee | Story Points | Status |
|---|---|---|---|---|---|
| **CAN-107** | Story | Instrument Prometheus metrics (`canteen_crowd_level`, `canteen_active_orders`, `http_requests_total`) | Trish | 5 | Done |
| **CAN-108** | Story | Build Order Tracking screen with live token lookup and 4-stage stepper | Tanay | 5 | Done |
| **CAN-109** | Story | Build Vendor Admin Console for queue management and stock toggling | Tanay | 8 | Done |
| **CAN-110** | Task | Configure `prometheus.yml` scrape targets and automated interval | Krish | 3 | Done |
| **CAN-111** | Task | Provision Grafana data source and pre-built JSON dashboard panels | Krish | 5 | Done |
| **CAN-112** | Task | Write automated unit tests for `/health`, `/metrics`, and `/api/orders` | Trish | 5 | Done |

---

### 🎯 Sprint 3: CI/CD Pipeline & AWS Cloud Provisioning
**Sprint Goal:** Automate end-to-end deployment via Jenkinsfile and provision AWS cloud infrastructure with Terraform.

| Issue Key | Type | Summary | Assignee | Story Points | Status |
|---|---|---|---|---|---|
| **CAN-113** | Story | Configure Declarative `Jenkinsfile` with Lint, Test, Docker Build & Deploy stages | Krish | 8 | Done |
| **CAN-114** | Story | Author Terraform `main.tf` to provision AWS EC2, Security Groups, and user data | Krish | 5 | Done |
| **CAN-115** | Task | Setup GitHub Webhook integration with Jenkins pipeline | Krish | 3 | Done |
| **CAN-116** | Task | End-to-end Smoke verification and team demo dry-run | Krish, Trish, Tanay | 3 | Done |

---

## 📝 User Story Details (Ready to Copy to Jira)

### Story: CAN-107 (Prometheus Instrumentation)
- **Description:** As a DevOps engineer and canteen manager, I want the backend to export live operational metrics on `/metrics`, so that Prometheus and Grafana can track queue congestion and response times.
- **Acceptance Criteria:**
  1. `GET /metrics` returns Prometheus text format.
  2. `canteen_crowd_level` gauge reflects current status (1=Low, 2=Moderate, 3=High, 4=Peak).
  3. `canteen_active_orders` updates whenever a new order is placed or marked completed.
  4. Response time histogram `http_request_duration_seconds` logs latency.

### Story: CAN-103 (React Live Crowd Meter)
- **Description:** As a college student, I want to see the live crowd status and estimated wait time before heading to the canteen, so that I don't waste recess time standing in long queues.
- **Acceptance Criteria:**
  1. Displays crowd badge (Low / Moderate / High / Peak) with color coding.
  2. Displays numeric queue headcount and estimated wait minutes.
  3. Provides a "Report Crowd Status" modal for students to submit live reports.
  4. Auto-refreshes data periodically.
