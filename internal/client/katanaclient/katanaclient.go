package katanaclient

import (
	"fmt"
	"net/http"
	"time"

	"resty.dev/v3"
)

type KatanaClient struct {
	KClient *resty.Client
}

var client = &http.Client{
	Timeout: 30 * time.Second,
	Transport: &http.Transport{

		MaxIdleConns:          500,
		MaxIdleConnsPerHost:   100,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
		ForceAttemptHTTP2:     true,
	},
}

func NewKatanaClient(host, key string) *KatanaClient {

	h := fmt.Sprintf("https://%s/api/v2", host)
	fmt.Println(h)
	client := resty.NewWithClient(client).SetBaseURL(h).SetHeader("Apikey", key)
	return &KatanaClient{
		KClient: client,
	}

}
