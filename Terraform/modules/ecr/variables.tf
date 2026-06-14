variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "services" {
  description = "List of service names for ECR repositories"
  type        = list(string)
  default     = ["shell", "landing-page", "dashboard", "item-management", "bff-gateway", "auth-api", "user-api", "item-api"]
}
