resource "aws_eip" "dev_server_eip" {
  instance = var.dev_instance_id
  vpc      = true
}

resource "aws_eip" "prod_server_eip" {
  instance = var.prod_instance_id
  vpc      = true
}