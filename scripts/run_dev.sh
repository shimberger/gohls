#!/bin/bash

PATH=$GOPATH/bin/:$PATH
cp buildinfo.go.in buildinfo.go
go generate
DEBUG=true go run *.go ${@:1}