#!/bin/bash

PATH=$GOPATH/bin/:$PATH
cp buildinfo.go.in buildinfo.go
go-bindata -prefix ui/build ui/build/...
go run *.go ${@:1}