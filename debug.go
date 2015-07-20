package main

import (
	"flag"
	"log"
)

var enableDebugging = false

func init() {
	flag.BoolVar(&enableDebugging, "debug", false, "debug output")
}

var debug Debugger = false

type Debugger bool

func (d Debugger) Printf(format string, args ...interface{}) {
	if enableDebugging {
		log.Printf("DEBUG: "+format, args...)
	}
}
