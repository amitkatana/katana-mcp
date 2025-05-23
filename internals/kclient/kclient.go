package kclient

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"sync"

	"github.com/google/go-querystring/query"
)

var errNonNilContext = errors.New("context must be non-nil")

type Client struct {
	clientMu sync.Mutex   // clientMu protects the client during calls that modify the CheckRedirect func.
	client   *http.Client // HTTP client used to communicate with the API.
	BaseURL  *url.URL
	common   service // Reuse a single struct instead of allocating one for each service on the heap.

	Product *ProductService
}

type service struct {
	client *Client
}

func NewClient(host string, apiKey string) *Client {

	parseUrl, err := url.Parse(host)
	if err != nil {
		fmt.Errorf("failed to parse url ")
		os.Exit(1)
	}

	client := &http.Client{}
	c := &Client{client: client}

	c.BaseURL = parseUrl

	transport := c.client.Transport

	if transport == nil {
		transport = http.DefaultTransport
	}

	c.client.Transport = roundTrapperFunc(func(req *http.Request) (*http.Response, error) {
		req.Header.Set("apiKey", apiKey)
		fmt.Println(apiKey)
		return transport.RoundTrip(req)
	})

	c.initialize()
	return c
}

func (c *Client) initialize() {
	c.common.client = c

	c.Product = (*ProductService)(&c.common)
}

type roundTrapperFunc func(*http.Request) (*http.Response, error)

func (fn roundTrapperFunc) RoundTrip(r *http.Request) (*http.Response, error) {
	return fn(r)
}

type Reponse struct {
	*http.Response
}

type RequestOption func(req *http.Request)

func newRepsonse(r *http.Response) *Reponse {
	response := &Reponse{Response: r}

	return response
}

func (c *Client) NewRequest(method, urlstring string, body interface{}, opts ...RequestOption) (*http.Request, error) {

	u, err := c.BaseURL.Parse(urlstring)

	if err != nil {
		return nil, err
	}

	var buf io.ReadWriter
	if body != nil {
		buf = &bytes.Buffer{}
		enc := json.NewEncoder(buf)
		enc.SetEscapeHTML(false)
		err := enc.Encode(body)
		if err != nil {
			return nil, err
		}
	}

	req, err := http.NewRequest(method, u.String(), buf)

	if err != nil {
		return nil, err
	}

	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	return req, nil

}

func addOptions(s string, opts interface{}) (string, error) {
	v := reflect.ValueOf(opts)
	if v.Kind() == reflect.Ptr && v.IsNil() {
		return s, nil
	}

	u, err := url.Parse(s)
	if err != nil {
		return s, err
	}

	qs, err := query.Values(opts)
	if err != nil {
		return s, err
	}

	u.RawQuery = qs.Encode()
	return u.String(), nil
}

func (c *Client) bareDo(ctx context.Context, caller *http.Client, req *http.Request) (*Reponse, error) {
	if ctx == nil {
		return nil, errNonNilContext
	}

	resp, err := caller.Do(req)

	var response *Reponse

	if resp != nil {
		response = newRepsonse(resp)
	}

	if err != nil {
		select {
		case <-ctx.Done():
			return response, ctx.Err()
		default:
		}
	}

	return response, nil

}

func (c *Client) BareDo(ctx context.Context, req *http.Request) (*Reponse, error) {
	return c.bareDo(ctx, c.client, req)
}

func (c *Client) Do(ctx context.Context, req *http.Request, v interface{}) (*Reponse, error) {

	resp, err := c.BareDo(ctx, req)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	switch v := v.(type) {
	case nil:
	case io.Writer:
		_, err = io.Copy(v, resp.Body)
	default:
		decErr := json.NewDecoder(resp.Body).Decode(v)
		if decErr == io.EOF {
			decErr = nil // ignore EOF errors caused by empty response body
		}
		if decErr != nil {
			err = decErr
		}
	}
	return resp, err

}
