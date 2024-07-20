output "dev_instance_id" {
  value = aws_instance.dev_server.id
}

output "prod_instance_id" {
  value = aws_instance.prod_server.id
}

output "dev_server_public_ip" {
  value = aws_instance.dev_server.public_ip
}

output "prod_server_public_ip" {
  value = aws_instance.prod_server.public_ip
}