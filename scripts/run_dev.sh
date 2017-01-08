#!/bin/bash

PATH=$GOPATH/bin/:$PATH
cp buildinfo.go.in buildinfo.go
go-bindata -debug -prefix ui/build ui/build/...
DEBUG=true go run *.go ${@:1}