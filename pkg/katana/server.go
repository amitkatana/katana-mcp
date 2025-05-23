package katana

import (
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

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

// 3. Checks if the parameter is not empty, i.e: non-zero value
func requiredParam[T comparable](r mcp.CallToolRequest, p string) (T, error) {
	var zero T
	// Check if the parameter is present in the request
	arguments, ok := r.Params.Arguments.(map[string]any)
	if !ok {
		return zero, fmt.Errorf("invalid arguments type")
	}

	if _, ok := arguments[p]; !ok {
		return zero, fmt.Errorf("missing required parameter: %s", p)
	}
	// Check if the parameter is of the expected type
	if _, ok := arguments[p].(T); !ok {
		return zero, fmt.Errorf("parameter %s is not of type %T", p, zero)
	}

	if arguments[p].(T) == zero {
		return zero, fmt.Errorf("missing required parameter: %s", p)

	}

	return arguments[p].(T), nil
}

func OptionalParam[T any](r mcp.CallToolRequest, p string) (T, error) {
	var zero T

	// Check if the parameter is present in the request
	arguments, ok := r.Params.Arguments.(map[string]any)

	if !ok {
		return zero, fmt.Errorf("invalid arguments type")
	}

	if _, ok := arguments[p]; !ok {
		return zero, nil
	}

	// Check if the parameter is of the expected type
	if _, ok := arguments[p].(T); !ok {
		return zero, fmt.Errorf("parameter %s is not of type %T, is %T", p, zero, arguments[p])
	}

	return arguments[p].(T), nil
}
