// Copyright 2013 The go-github AUTHORS. All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package kclient

import (
	"strconv"
	"time"
)

// Timestamp represents a time that can be unmarshaled from a JSON string
// formatted as either an RFC3339 or Unix timestamp. This is necessary for some
// fields since the GitHub API is inconsistent in how it represents times. All
// exported methods of time.Time can be called on Timestamp.
type Timestamp struct {
	time.Time
}

func (t Timestamp) String() string {
	return t.Time.String()
}

// GetTime returns std time.Time.
func (t *Timestamp) GetTime() *time.Time {
	if t == nil {
		return nil
	}
	return &t.Time
}

// UnmarshalJSON implements the json.Unmarshaler interface.
// Time is expected in RFC3339 or Unix format.
func (t *Timestamp) UnmarshalJSON(data []byte) (err error) {
	str := string(data)
	i, err := strconv.ParseInt(str, 10, 64)
	if err == nil {
		t.Time = time.Unix(i, 0)
		if t.Time.Year() > 3000 {
			t.Time = time.Unix(0, i*1e6)
		}
	} else {
		t.Time, err = time.Parse(`"`+time.RFC3339+`"`, str)
	}
	return
}

// Equal reports whether t and u are equal based on time.Equal.
func (t Timestamp) Equal(u Timestamp) bool {
	return t.Time.Equal(u.Time)
}
