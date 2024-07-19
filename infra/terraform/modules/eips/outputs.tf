output "dev_eip" {
  value = aws_eip.dev_server_eip.id
}

output "prod_eip" {
  value = aws_eip.prod_server_eip.id
}