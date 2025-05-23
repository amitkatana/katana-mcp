package toolsets

import (
	"encoding/json"
	"fmt"
	"time"
)

type APITime time.Time

// Try RFC3339Nano (with zone/fraction) first, then a no-zone fallback.
var apiLayouts = []string{
	time.RFC3339Nano,              // e.g. "2006-01-02T15:04:05.999999999Z07:00"
	"2006-01-02T15:04:05.9999999", // up to 7 fraction digits, no zone
}

func (t *APITime) UnmarshalJSON(b []byte) error {
	// 1) Extract the raw string
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}
	// 2) Try each layout
	for _, layout := range apiLayouts {
		if parsed, err := time.Parse(layout, s); err == nil {
			*t = APITime(parsed.UTC())
			return nil
		}
	}
	return fmt.Errorf("APITime: unrecognized format %q", s)
}

func (t APITime) MarshalJSON() ([]byte, error) {
	ts := time.Time(t).UTC().Format(time.RFC3339Nano)
	return json.Marshal(ts)
}
