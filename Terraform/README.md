# Terraform — AWS Infrastructure

Manages all AWS infrastructure for the React Micro platform using Terraform modules.

## Structure

```
Terraform/
├── main.tf              Provider + S3 backend config
├── infrastructure.tf    Root — wires all modules together
├── variables.tf         Input variables
├── outputs.tf           Exported resource values
├── environments/
│   ├── dev/terraform.tfvars
│   └── prod/terraform.tfvars
└── modules/
    ├── vpc/   VPC, subnets, NAT gateways
    ├── ecr/   ECR repos for all 8 services
    ├── ecs/   Fargate cluster + IAM roles
    ├── rds/   PostgreSQL instances + Secrets Manager
    └── alb/   Application Load Balancer
```

## Quick Commands

```bash
# Initialize (first time)
terraform init

# Plan for dev
terraform plan -var-file="environments/dev/terraform.tfvars"

# Apply
terraform apply -var-file="environments/dev/terraform.tfvars"

# Destroy dev (never run for prod without approval)
terraform destroy -var-file="environments/dev/terraform.tfvars"
```

## What Gets Created

- VPC with public / private / database subnet tiers across 2 AZs (3 for prod)
- NAT Gateways for private subnet egress
- ECR repositories with lifecycle policies
- ECS Fargate cluster with Container Insights
- 3× RDS PostgreSQL 15 instances (auth, user, item) with Secrets Manager passwords
- Application Load Balancer with HTTPS redirect

See [Terraform documentation](../docs/terraform/overview.md) for full module reference.
