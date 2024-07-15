resource "aws_instance" "dev_server" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = var.subnet1_id
  key_name               = var.key_name
  vpc_security_group_ids = [var.security_group_id]

  root_block_device {
    volume_size = 10
  }

  tags = {
    Name = "dev-server"
  }
}

resource "aws_instance" "prod_server" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = var.subnet2_id
  key_name               = var.key_name
  vpc_security_group_ids = [var.security_group_id]

  root_block_device {
    volume_size = 10
  }

  tags = {
    Name = "prod-server"
  }
}