#!/bin/bash

PATH=$GOPATH/bin/:$PATH
cp buildinfo.go.in buildinfo.go
go generate
go run *.go ${@:1}