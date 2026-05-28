package language

import (
	"context"
	"fmt"
	"sync"

	katanahttp "github.com/tritac/katana-mcp-goo/internal/client/katanaclient"
	"github.com/tritac/katana-mcp-goo/internal/data/language"
)

type Core struct {
	kc *katanahttp.KatanaClient

	mu     sync.RWMutex
	cached []language.Language
}

func NewCore(kc *katanahttp.KatanaClient) *Core {
	return &Core{kc: kc}
}

func (c *Core) List(ctx context.Context) ([]language.Language, error) {
	c.mu.RLock()
	if c.cached != nil {
		out := c.cached
		c.mu.RUnlock()
		return out, nil
	}
	c.mu.RUnlock()

	c.mu.Lock()
	defer c.mu.Unlock()
	if c.cached != nil {
		return c.cached, nil
	}

	var env language.ResponseEnvelope
	_, err := c.kc.KClient.R().SetResult(&env).Get("/v2/languages")
	if err != nil {
		return nil, fmt.Errorf("fetch languages: %w", err)
	}
	c.cached = env.Items
	return c.cached, nil
}

func (c *Core) Refresh(ctx context.Context) error {
	c.mu.Lock()
	c.cached = nil
	c.mu.Unlock()
	_, err := c.List(ctx)
	return err
}
