output "vpc_id" {
  value = aws_vpc.main.id
}

output "main_route_table_id" {
  value = aws_route_table.main_route_table.id
}