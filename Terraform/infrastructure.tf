# Root Module Configuration
# Import all infrastructure modules

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr           = var.vpc_cidr
  project_name       = var.project_name
  environment        = var.environment
  availability_zones = var.availability_zones
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Security group for RDS instances"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "PostgreSQL from ECS tasks"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [module.ecs.security_group_id]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-rds-sg"
  }
}

# ECR Module
module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  environment  = var.environment
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}

# ALB Module
module "alb" {
  source = "./modules/alb"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
}

# RDS Instances (one per service)
module "rds_auth" {
  source = "./modules/rds"

  project_name           = var.project_name
  environment            = var.environment
  service_name           = "auth"
  database_name          = "auth_db"
  db_subnet_group_name   = module.vpc.db_subnet_group_name
  vpc_security_group_ids = [aws_security_group.rds.id]
  instance_class         = var.db_instance_class
}

module "rds_user" {
  source = "./modules/rds"

  project_name           = var.project_name
  environment            = var.environment
  service_name           = "user"
  database_name          = "user_db"
  db_subnet_group_name   = module.vpc.db_subnet_group_name
  vpc_security_group_ids = [aws_security_group.rds.id]
  instance_class         = var.db_instance_class
}

module "rds_item" {
  source = "./modules/rds"

  project_name           = var.project_name
  environment            = var.environment
  service_name           = "item"
  database_name          = "item_db"
  db_subnet_group_name   = module.vpc.db_subnet_group_name
  vpc_security_group_ids = [aws_security_group.rds.id]
  instance_class         = var.db_instance_class
}
