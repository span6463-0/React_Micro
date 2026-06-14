# Deployment Guide

This guide covers building Docker images, pushing to ECR, provisioning infrastructure, and deploying services to AWS ECS Fargate.

---

## Prerequisites

- AWS CLI configured: `aws configure`
- Terraform installed and initialized
- Docker Desktop running
- Access to the AWS account and ECR repositories

---

## Step 1 — Provision Infrastructure (First Time Only)

```bash
cd Terraform

# Initialize Terraform (configure S3 backend)
terraform init

# Preview resources to be created
terraform plan -var-file="environments/dev/terraform.tfvars"

# Create infrastructure
terraform apply -var-file="environments/dev/terraform.tfvars"
```

After apply, capture the outputs:

```bash
terraform output -json > terraform-outputs.json
```

You will need:

- `alb_dns_name` — Configure your DNS to point to this
- `ecr_repository_urls` — For pushing Docker images
- `rds_endpoints` — For application environment variables (sensitive)

---

## Step 2 — Build Docker Images

Build all service images from the project root:

```bash
# BFF Gateway
docker build -t react-micro/bff-gateway:latest -f BFF/gateway/Dockerfile ./BFF/gateway

# Auth API
docker build -t react-micro/auth-api:latest -f API/auth-api/Dockerfile ./API/auth-api

# User API
docker build -t react-micro/user-api:latest -f Infrastructure/docker/Dockerfile.api ./API/user-api

# Item API
docker build -t react-micro/item-api:latest -f Infrastructure/docker/Dockerfile.api ./API/item-api

# Frontend apps
docker build -t react-micro/shell:latest -f Infrastructure/docker/Dockerfile.frontend ./Frontend/shell
docker build -t react-micro/landing-page:latest -f Infrastructure/docker/Dockerfile.frontend ./Frontend/LandingPage
docker build -t react-micro/dashboard:latest -f Infrastructure/docker/Dockerfile.frontend ./Frontend/Dashboard
docker build -t react-micro/item-management:latest -f Infrastructure/docker/Dockerfile.frontend ./Frontend/Item-management
```

---

## Step 3 — Push to ECR

```bash
# Set your AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=us-east-1
ECR_BASE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_BASE

# Tag and push each image
for SERVICE in bff-gateway auth-api user-api item-api shell landing-page dashboard item-management; do
  docker tag react-micro/${SERVICE}:latest ${ECR_BASE}/react-micro/${SERVICE}:latest
  docker push ${ECR_BASE}/react-micro/${SERVICE}:latest
  echo "Pushed ${SERVICE}"
done
```

---

## Step 4 — Deploy to ECS

ECS services pick up the new image on the next deployment. Force a new deployment:

```bash
CLUSTER="react-micro-dev-cluster"

for SERVICE in bff-gateway auth-api user-api item-api; do
  aws ecs update-service \
    --cluster $CLUSTER \
    --service $SERVICE \
    --force-new-deployment \
    --region $AWS_REGION
  echo "Deploying $SERVICE..."
done
```

Monitor deployment status:

```bash
aws ecs describe-services \
  --cluster $CLUSTER \
  --services bff-gateway auth-api user-api item-api \
  --query 'services[*].{name:serviceName,status:status,running:runningCount,desired:desiredCount}'
```

---

## Step 5 — Run Database Migrations

After first deploy (or schema changes), run migrations against the RDS instances. The easiest approach is running migrations from a temporary ECS task or a bastion host in the VPC:

```bash
# Example: run migration from local machine through an SSH tunnel or VPN
AUTH_DB_HOST=<rds-endpoint-from-terraform-output> \
AUTH_DB_PORT=5432 \
AUTH_DB_NAME=auth_db \
AUTH_DB_USER=postgres \
AUTH_DB_PASSWORD=<from-secrets-manager> \
npx knex migrate:latest
```

---

## Environment Variables in AWS

Service environment variables are configured in ECS Task Definitions. Secrets are referenced from **AWS Secrets Manager**:

```json
{
  "secrets": [
    {
      "name": "DB_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:123456:secret:react-micro-dev-auth-db-password"
    }
  ]
}
```

Never hardcode secrets in task definitions or Dockerfiles.

---

## Rollback Procedure

If a deployment causes issues:

```bash
# List recent task definitions
aws ecs list-task-definitions --family-prefix react-micro-bff-gateway

# Roll back to a previous task definition revision
aws ecs update-service \
  --cluster $CLUSTER \
  --service bff-gateway \
  --task-definition react-micro-bff-gateway:N  # N = previous revision number
```

---

## Health Checks

All services expose `GET /health` returning `200 OK`. The ALB performs health checks every 30 seconds:

- **Healthy threshold**: 2 consecutive successes
- **Unhealthy threshold**: 3 consecutive failures
- **Timeout**: 5 seconds

Monitor the ALB target group health in the AWS Console or via CLI:

```bash
aws elbv2 describe-target-health \
  --target-group-arn <target-group-arn>
```

---

## Production Checklist

Before deploying to production:

- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Environment variables updated in AWS Secrets Manager
- [ ] Database migrations reviewed and tested in staging
- [ ] Docker images built from the `main` branch only
- [ ] `terraform plan` reviewed for unintended changes
- [ ] Rollback plan documented
- [ ] On-call engineer notified
