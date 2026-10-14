# 🍔 CampusBite — College Canteen Queue & Crowd Tracker
 
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


