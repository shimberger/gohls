package config

import (
	"crypto/sha1"
	"fmt"
)

func getHash(str string) string {
	h := sha1.New()
	h.Write([]byte(str))
	return fmt.Sprintf("%x", h.Sum(nil))
}
