package main

import (
	"flag"
	"log"
)

type Debugger struct {
	debug bool
}

var enableDebugging = true

func init() {
	flag.BoolVar(&enableDebugging, "debug", true, "debug output")
	debug = &Debugger{enableDebugging}
}

var debug *Debugger = nil

func (d Debugger) Printf(format string, args ...interface{}) {
	if enableDebugging {
		log.Printf("DEBUG: "+format, args...)
	}
}
