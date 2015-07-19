package main

import (
	"log"
)

var debug Debugger = false

type Debugger bool

func (d Debugger) Printf(format string, args ...interface{}) {
	if d {
		log.Printf("DEBUG: "+format, args...)
	}
}
