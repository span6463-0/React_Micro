---
applyTo: 'Terraform/**'
---

# Terraform Instructions

## AWS Infrastructure

This project deploys to AWS using:

- **ECS Fargate**: Container orchestration
- **RDS PostgreSQL**: Managed databases
- **MSK**: Managed Kafka (or self-hosted on ECS)
- **ALB**: Application Load Balancer
- **ECR**: Container registry
- **VPC**: Network isolation
- **Secrets Manager**: Credentials storage
- **CloudWatch**: Logging and monitoring

## Module Structure

```
Terraform/
├── modules/
│   ├── vpc/              # VPC, subnets, NAT
│   ├── ecs/              # ECS cluster, services
│   ├── rds/              # RDS PostgreSQL instances
│   ├── alb/              # Load balancer
│   ├── ecr/              # Container registries
│   ├── kafka/            # MSK or ECS Kafka
│   └── secrets/          # Secrets Manager
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── prod/
└── backend.tf            # S3 state backend
```

## Naming Convention

```hcl
# Pattern: {project}-{environment}-{service}-{resource}
resource "aws_ecs_service" "auth_api" {
  name = "react-micro-${var.environment}-auth-api"
  ...
}
```

## Tagging Standard

```hcl
locals {
  common_tags = {
    Project     = "react-micro"
    Environment = var.environment
    ManagedBy   = "terraform"
    Owner       = "platform-team"
  }
}
```

## State Management

- S3 backend with versioning
- DynamoDB for state locking
- Separate state file per environment
- Never commit .tfstate files

## Security

- Use IAM roles, not access keys
- Encrypt RDS at rest
- Private subnets for services
- Security groups with minimal access
- Secrets in AWS Secrets Manager

## Variables Pattern

```hcl
variable "environment" {
  description = "Deployment environment"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}
```
