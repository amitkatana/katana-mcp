package main

import (
	"context"
	"fmt"
	"katanampc/internals/data"
	"katanampc/internals/kclient"
)

func main() {
	ctx := context.Background()
	client := kclient.NewClient("https://demo.katanapim.com", "efwjhiyb*&bhjud789")
	opts := &data.ProductOptions{
		Name:     "red shoes",
		Keywords: "",
		Paging:   data.Paging{PageIndex: 0, PageSize: 10, DefaultPageSize: 10},
	}

	products, resp, err := client.Product.GetProducts(ctx, opts)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(products)
	fmt.Println(resp)
}
