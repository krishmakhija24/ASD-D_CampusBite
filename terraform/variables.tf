variable "aws_region" {
  description = "AWS Region to deploy Canteen Tracker"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 Instance type"
  type        = string
  default     = "t3.small"
}

variable "key_name" {
  description = "Name of the AWS SSH Key Pair"
  type        = string
  default     = "canteen-key"
}
