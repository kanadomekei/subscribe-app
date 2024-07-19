resource "aws_key_pair" "deployer" {
  key_name   = var.key_name
  public_key = file("~/.ssh/my_terraform_key.pub")
}