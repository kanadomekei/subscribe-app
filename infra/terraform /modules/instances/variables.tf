variable "ami" {
  description = "The AMI ID for the instances"
}

variable "instance_type" {
  description = "The instance type for the instances"
}

variable "key_name" {
  description = "The name of the SSH key pair"
}

variable "subnet1_id" {
  description = "The ID of subnet 1"
}

variable "subnet2_id" {
  description = "The ID of subnet 2"
}

variable "security_group_id" {
  description = "The ID of the security group"
}