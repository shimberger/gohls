#!/bin/bash

PATH=$GOPATH/bin/:$PATH
go-bindata -debug -prefix ui/build ui/build/...
go run *.go ${@:1}