


run:
	go run ./apps/katana-mcp/ 

help:
	go run ./apps/katana-mcp/ --help

build: 
	go build ./apps/katana-mcp/


dev: 
	go run ./apps/katana-mcp/ --api-key=API_KET --host=HOST_ADDRESS