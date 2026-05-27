package product

import (
	"strings"
	"time"
)

const katanaTimestampLayout = "2006-01-02T15:04:05.9999999"

type RFC3339ts struct {
	time.Time
}

func (ct *RFC3339ts) UnmarshalJSON(b []byte) error {
	s := strings.Trim(string(b), `"`)
	if s == "null" || s == "" {
		return nil
	}
	t, err := time.Parse(katanaTimestampLayout, s)
	if err != nil {
		return err
	}
	ct.Time = t.UTC()
	return nil
}
