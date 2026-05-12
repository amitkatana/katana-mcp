package database

import (
	"errors"
	"log"
	"net/url"

	"github.com/jmoiron/sqlx"
	_ "github.com/microsoft/go-mssqldb"
)

// Set of error variables for CRUD operations.
var (
	ErrNotFound              = errors.New("not found")
	ErrInvalidID             = errors.New("ID is not in its proper form")
	ErrAuthenticationFailure = errors.New("authentication failed")
	ErrForbidden             = errors.New("attempted action is not allowed")
)

func Open() (*sqlx.DB, error) {
	query := url.Values{}
	query.Add("database", "wabtecnl_katanapim")

	// Use url.URL to safely encode special characters in passwords
	u := &url.URL{
		Scheme:   "sqlserver",
		User:     url.UserPassword("user", "password"),
		Host:     "overflowlabs.org",
		RawQuery: query.Encode(),
	}
	db, err := sqlx.Open("sqlserver", u.String())

	if err != nil {
		log.Fatal("Error creating connection pool: ", err.Error())
	}
	return db, err
}
