package kclient

import (
	"context"
	"fmt"
	"katanampc/internals/data"
)

type ProductService service

func (p *ProductService) GetProducts(ctx context.Context, opts *data.ProductOptions) (*data.PagedProducts, *Reponse, error) {
	u := fmt.Sprintf("api/v1/Product")
	u, err := addOptions(u, opts)

	if err != nil {
		return nil, nil, err
	}
	req, err := p.client.NewRequest("GET", u, nil)

	if err != nil {
		return nil, nil, err
	}

	var products *data.PagedProducts

	resp, err := p.client.Do(ctx, req, &products)

	if err != nil {
		return nil, resp, err
	}
	return products, resp, nil

}
