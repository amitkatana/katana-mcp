


run:
	go run ./apps/katana-mcp/ 

help:
	go run ./apps/katana-mcp/ --help

build: 
	go build ./apps/katana-mcp/


dev: 
	go run ./apps/katana-mcp/ --api-key=API_KET --host=HOST_ADDRESS

build_win:
	GOOS=windows GOARCH=amd64 go build -o katana_mcp_win64.exe ./apps/katana-mcp/


build_unix:
	GOOS=linux GOARCH=amd64 go build -o katana_mcp_linux_amd64 ./apps/katana-mcp/