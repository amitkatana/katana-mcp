package katana

import "github.com/mark3labs/mcp-go/server"

func NewServer(version string, opts ...server.ServerOption) *server.MCPServer {
	defaultOpts := []server.ServerOption{
		server.WithToolCapabilities(true),
		server.WithResourceCapabilities(true, true),
		server.WithLogging(),
	}

	opts = append(defaultOpts, opts...)
	s := server.NewMCPServer("katana-mcp-server", version, opts...)
	return s
}
