# 🍔 CampusBite — College Canteen Queue & Crowd Tracker
> A full-stack, DevOps-instrumented web platform for real-time college cafeteria crowd tracking, menu pre-ordering, kitchen queue management, and Prometheus/Grafana telemetry.

**Developed by:** **Krish** (DevOps Lead), **Trish** (Backend & DB Engineer), **Tanay** (Frontend & UI Engineer)  
**Academic Context:** Covers Experiments 1 through 9 for Agile Software Development & DevOps Lab.

---

## 🌟 Key Features

### 1. Student Portal
- **Live Crowd Gauge:** Real-time crowd status (`LOW`, `MODERATE`, `HIGH`, `PEAK`) with visual capacity progress bar.
- **Dynamic Wait Time Estimator:** Predicts counter queue wait time in minutes using active order velocity.
- **Live Menu & Pre-Ordering:** Browse categorised snacks and meals with dietary indicators (Veg/Non-Veg), prep times, and descriptions.
- **Queue Skip Pre-Orders:** Pre-order snacks online with UPI/Cash/Card to skip long payment queues.
- **Real-Time Token Tracking:** Visual 4-stage stepper (`Placed` → `Preparing` → `Ready for Pickup` → `Completed`) with queue rank.
- **Crowdsourced Feedback:** Students can submit live observations to update the crowd meter.

### 2. Canteen Vendor / Admin Console
- **Crowd Level Switcher:** 1-click status override with queue headcount adjustments.
- **Kitchen Order Management:** Live order board with status transition controls (`Start Cooking`, `Mark Ready`, `Complete`).
- **Live Menu Management:** Add new items, update prices, and toggle in-stock / out-of-stock instantly.
- **Business KPI Metrics:** Real-time revenue counter, completed orders, and active cooking queue.

### 3. DevOps & Observability (Expt 1 to 9)
- **Prometheus Telemetry:** Exposes custom business metrics on `/metrics` (`canteen_crowd_level`, `canteen_active_orders`, `canteen_estimated_wait_minutes`, `http_requests_total`).
- **Grafana Dashboards:** Pre-provisioned dashboards with live crowd gauges, queue gauges, and latency timeseries.
- **Multi-Service Docker Compose:** Links Frontend, Backend, PostgreSQL, Prometheus, and Grafana.
- **Automated CI/CD Pipeline:** Declarative `Jenkinsfile` executing checkout, syntax linting, pytest tests, Docker container builds, smoke tests, and deployment.
- **Terraform IaC:** AWS EC2 and security group provisioning (`terraform/main.tf`).

---

## 🚀 Quick Start (Two Ways to Run)

### Method 1: Run Locally (Fastest - No Docker Required)

#### 1. Start the Flask Backend:
```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```
> Backend starts on **`http://localhost:5000`** (auto-seeds menu, orders, and Prometheus metrics).  
> Test endpoints:  
> - Health Check: `http://localhost:5000/health`  
> - Prometheus Metrics: `http://localhost:5000/metrics`  
> - API Menu: `http://localhost:5000/api/menu`

#### 2. Start the React Frontend:
```bash
cd frontend
npm install
npm run dev
```
> Frontend starts on **`http://localhost:3000`** with real-time API proxying to Flask.

---

### Method 2: Run Multi-Service Stack with Docker Compose

Ensure Docker Desktop is running, then run:
```bash
docker compose up -d --build
```

#### Service URLs:
| Service | URL | Default Credentials |
|---|---|---|
| **Canteen Frontend Web UI** | `http://localhost:3000` | N/A |
| **Flask REST Backend API** | `http://localhost:5000` | N/A |
| **Prometheus Metrics Explorer** | `http://localhost:9090` | N/A |
| **Grafana Observability Dashboard** | `http://localhost:3001` | `admin` / `admin` |
| **PostgreSQL Database** | `localhost:5432` | `canteen_user` / `canteen_pass` |

To stop the stack:
```bash
docker compose down
```

---

## 🧪 Automated Testing (Jenkins CI Stage 3)

Run the backend unit test suite:
```bash
cd backend
pytest tests/test_api.py -v
```

---

## 👥 Git Team Workflow (Krish, Trish & Tanay)

To set up your Git repository with commits representing the 3 teammates:

```powershell
.\init-team-git.ps1
```
Or review `GIT_TEAM_WORKFLOW.md` for individual Git commands for each team member.

---

## 📁 Repository Structure

```
college-canteen-tracker/
├── backend/
│   ├── app.py                     # Flask application & database configuration
│   ├── models.py                  # SQLAlchemy models (MenuItem, Order, CrowdStatus)
│   ├── metrics.py                 # Prometheus metrics collectors & latency middleware
│   ├── routes/
│   │   └── api.py                 # REST API endpoints
│   ├── tests/
│   │   └── test_api.py            # Pytest automated test suite
│   ├── requirements.txt           # Python dependencies
│   └── Dockerfile                 # Multi-stage production container
├── frontend/
│   ├── src/
│   │   ├── components/            # React UI components (CrowdMeter, LiveMenu, Admin, etc.)
│   │   ├── App.jsx                # Main application state & API synchronization
│   │   └── index.css              # Glassmorphic responsive dark theme styling
│   ├── nginx.conf                 # Nginx reverse proxy configuration
│   ├── package.json               # Node dependencies
│   └── Dockerfile                 # Production Vite -> Nginx build
├── monitoring/
│   ├── prometheus.yml             # Prometheus scraper configuration
│   └── grafana/
│       ├── provisioning/          # Automated datasource & dashboard providers
│       └── dashboards/            # Pre-configured Canteen metrics JSON dashboard
├── terraform/
│   ├── main.tf                    # AWS EC2 & Security Groups provisioning (Expt 9)
│   └── variables.tf               # Terraform variable definitions
├── docker-compose.yml             # 5-service orchestration stack (Expt 3)
├── Jenkinsfile                    # Declarative CI/CD pipeline (Expt 4, 5, 8)
├── JIRA_BACKLOG_AND_SPRINTS.md    # Agile Scrum user stories & epics (Expt 6)
├── GIT_TEAM_WORKFLOW.md           # Step-by-step Git commands for teammates (Expt 1)
├── EXPT_MAPPING_GUIDE.md          # 1-to-1 syllabus experiment mapping
└── init-team-git.ps1              # Automated git history generator
```

---

## 🎓 Lab Experiments Covered

- **Expt 1:** Version Control Operations using Git (`GIT_TEAM_WORKFLOW.md`)
- **Expt 2:** Containerize Application using Docker (`backend/Dockerfile`, `frontend/Dockerfile`)
- **Expt 3:** Multi-Service Applications with Docker Compose (`docker-compose.yml`)
- **Expt 4:** Jenkins Architecture & Pipeline Setup (`Jenkinsfile`)
- **Expt 5:** Automated Deployment using GitHub & Jenkins (`Jenkinsfile`)
- **Expt 6:** Jira Agile Backlog & Sprint Planning (`JIRA_BACKLOG_AND_SPRINTS.md`)
- **Expt 7:** Monitoring using Prometheus & Grafana (`monitoring/`, `metrics.py`)
- **Expt 8:** CI/CD Pipeline to AWS Cloud (`Jenkinsfile`, `terraform/`)
- **Expt 9:** Cloud Infrastructure Provisioning using Terraform (`terraform/main.tf`)
