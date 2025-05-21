package kmcp

import (
	"context"
	"fmt"
	"io"
	"katanampc/pkg/katana"
	"os"
	"os/signal"

	"github.com/mark3labs/mcp-go/server"
	"github.com/sirupsen/logrus"
)

type McpServerConfig struct {
	Version string
	Host    string
	ApiKey  string
}

func NewMcpServer(cfg McpServerConfig) (*server.MCPServer, error) {

	s := katana.NewServer(cfg.Version)

	toolsets, err := katana.InitToolsets()

	if err != nil {
		return nil, fmt.Errorf("failed to initialize toolsets: %w", err)
	}

	toolsets.RegisterTools(s)

	return s, nil

}

type StdioServerConfig struct {
	Varsion string
	Host    string
	ApiKey  string
}

func RunStdioServer(cfg StdioServerConfig) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()
	katanaServer, err := NewMcpServer(McpServerConfig{Host: cfg.Host, ApiKey: cfg.ApiKey})

	if err != nil {
		return fmt.Errorf("failed to create MCP server: %w", err)
	}
	stdioServer := server.NewStdioServer(katanaServer)
	logrusLogger := logrus.New()

	errC := make(chan error, 1)
	go func() {
		in, out := io.Reader(os.Stdin), io.Writer(os.Stdout)

		errC <- stdioServer.Listen(ctx, in, out)
	}()

	_, _ = fmt.Fprintf(os.Stderr, "Github MCP server started on stdio\n")

	select {
	case ctx := <-ctx.Done():
		logrusLogger.Infof("sutting down server: %v", ctx)
	case err := <-errC:
		if err != nil {
			return fmt.Errorf("error runnig server: %w,", err)
		}
	}
	return nil
}
