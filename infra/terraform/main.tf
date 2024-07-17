provider "aws" {
  region = var.region
}

module "vpc" {
  source = "./modules/vpc"
  vpc_cidr = var.vpc_cidr
}

module "subnets" {
  source = "./modules/subnets"
  vpc_id = module.vpc.vpc_id
  subnet1_cidr = var.subnet1_cidr
  subnet2_cidr = var.subnet2_cidr
  route_table_id = module.vpc.main_route_table_id
}

module "security_groups" {
  source = "./modules/security_groups"
  vpc_id = module.vpc.vpc_id
}

module "key_pair" {
  source = "./modules/key_pair"
  key_name = var.key_name
}

module "instances" {
  source = "./modules/instances"
  ami = var.ami
  instance_type = var.instance_type
  key_name = module.key_pair.key_name  
  subnet1_id = module.subnets.subnet1_id
  subnet2_id = module.subnets.subnet2_id
  security_group_id = module.security_groups.web_sg_id
}

module "eips" {
  source = "./modules/eips"
  dev_instance_id = module.instances.dev_instance_id
  prod_instance_id = module.instances.prod_instance_id
}