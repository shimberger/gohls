package main

import (
	"flag"
	"log"
)

var enableDebugging = false

func init() {
	flag.BoolVar(&enableDebugging, "debug", false, "debug output")
}

type Debugger struct{}

var debug Debugger = &Debugger{}

func (d Debugger) Printf(format string, args ...interface{}) {
	if enableDebugging {
		log.Printf("DEBUG: "+format, args...)
	}
}
