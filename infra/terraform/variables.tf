variable "region" {
  description = "The AWS region to deploy resources in"
  default     = "ap-northeast-1"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "subnet1_cidr" {
  description = "The CIDR block for subnet 1"
  default     = "10.0.1.0/24"
}

variable "subnet2_cidr" {
  description = "The CIDR block for subnet 2"
  default     = "10.0.2.0/24"
}

variable "ami" {
  description = "The AMI ID for the instances"
  default     = "ami-0a0b7b240264a48d7"
}

variable "instance_type" {
  description = "The instance type for the instances"
  default     = "t2.small"
}

variable "key_name" {
  description = "The name of the SSH key pair"
  default     = "my_terraform_key"
}