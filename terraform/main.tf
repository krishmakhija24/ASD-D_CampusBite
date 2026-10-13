# ==========================================================
# Terraform AWS Infrastructure as Code (IaC)
# Lab Expt 9: To provision cloud infrastructure using Terraform
# Lab Expt 8: CI/CD Pipeline to host a website on AWS
# ==========================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 1. Security Group for Canteen Tracker & Monitoring Stack
resource "aws_security_group" "canteen_sg" {
  name        = "canteen-tracker-security-group"
  description = "Security group for Canteen Web, API, Prometheus and Grafana"

  # SSH for remote maintenance
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend Web (HTTP / Nginx)
  ingress {
    description = "Frontend Web UI"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # React Vite Dev Port
  ingress {
    description = "React Port 3000"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend REST API & Prometheus /metrics
  ingress {
    description = "Flask Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Prometheus Server Web UI
  ingress {
    description = "Prometheus Monitoring"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Grafana Dashboard UI
  ingress {
    description = "Grafana Dashboard"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Egress - allow all outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "canteen-sg"
    Environment = "Production"
    Team        = "Krish-Trish-Tanay"
  }
}

# 2. Ubuntu 22.04 LTS AMI Data Source
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 3. EC2 Instance to Host Dockerized Canteen Stack
resource "aws_instance" "canteen_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.canteen_sg.id]

  # User data script to bootstrap Docker, Git and launch app automatically
  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io docker-compose git curl

              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu

              # Pull and start application
              mkdir -p /home/ubuntu/app
              cd /home/ubuntu/app
              echo "Canteen Cloud Host Initialized successfully." > init.log
              EOF

  tags = {
    Name    = "College-Canteen-Tracker-Host"
    Project = "DevOps Lab - Canteen Crowd Tracker"
    Owner   = "Krish"
  }
}

# Outputs
output "public_ip" {
  description = "Public IP address of the deployed AWS EC2 instance"
  value       = aws_instance.canteen_server.public_ip
}

output "website_url" {
  description = "Frontend Canteen Website URL"
  value       = "http://${aws_instance.canteen_server.public_ip}"
}

output "grafana_url" {
  description = "Grafana Observability Dashboard URL"
  value       = "http://${aws_instance.canteen_server.public_ip}:3001"
}

output "prometheus_url" {
  description = "Prometheus Metrics Explorer URL"
  value       = "http://${aws_instance.canteen_server.public_ip}:9090"
}
