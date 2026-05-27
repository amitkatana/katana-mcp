package widget

import (
	"context"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"
)

const WIDGET_VERSION = "v1.3"

var PRODUCT_LIST_URI = fmt.Sprintf("ui://widget/product-list-%s.html", WIDGET_VERSION)
var PRODUCT_DETAIL_URI = fmt.Sprintf("ui://widget/product-detail-%s.html", WIDGET_VERSION)

type MCPResourceHandler = func(ctx context.Context, request mcp.ReadResourceRequest) ([]mcp.ResourceContents, error)

// type Widget struct {
// 	URI           string                 `json:"uri"`
// 	Name          string                 `json:"name"`
// 	Description   string                 `json:"description"`
// 	HTMLPath      string                 `json:"html_path"`
// 	FallbackHTML  string                 `json:"fallback_html"`
// 	MimeType      string                 `json:"mime_type"`
// 	Meta          map[string]interface{} `json:"meta"`
// 	ToolMetaExtra map[string]interface{} `json:"tool_meta_extra"`
// }

// func NewWidget(uri, name, description, htmlPath string) *Widget {

// 	return &Widget{
// 		URI:           uri,
// 		Name:          name,
// 		Description:   description,
// 		HTMLPath:      htmlPath,
// 		FallbackHTML:  "<!doctype html><meta charset='utf-8'><div style='font-family:sans-serif;padding:1rem'>Widget bundle missing. Build it first.</div>",
// 		MimeType:      "text/html+skybridge",
// 		Meta:          make(map[string]interface{}),
// 		ToolMetaExtra: make(map[string]interface{}),
// 	}
// }

// // HTML reads the file content at HTMLPath or returns the FallbackHTML.
// func (w *Widget) HTML() string {
// 	content, err := os.ReadFile(w.HTMLPath)
// 	if err != nil {
// 		return w.FallbackHTML
// 	}
// 	return string(content)
// }

// // ToolMeta generates the metadata map for tool invocation.
// func (w *Widget) ToolMeta(invoking, invoked string) map[string]interface{} {
// 	// Set defaults if arguments are empty (Go doesn't support default params)
// 	if invoking == "" {
// 		invoking = "Working…"
// 	}
// 	if invoked == "" {
// 		invoked = "Done."
// 	}

// 	meta := map[string]interface{}{
// 		"ui": map[string]string{
// 			"resourceUri": w.URI,
// 		},
// 		"openai/outputTemplate":          w.URI,
// 		"openai/toolInvocation/invoking": invoking,
// 		"openai/toolInvocation/invoked":  invoked,
// 		"openai/widgetAccessible":        true,
// 	}

// 	// Merge ToolMetaExtra into the map
// 	for k, v := range w.ToolMetaExtra {
// 		meta[k] = v
// 	}

// 	return meta
// }
