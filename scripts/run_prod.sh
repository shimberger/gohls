#!/bin/bash

PATH=$GOPATH/bin/:$PATH
go-bindata -prefix ui/build ui/build/...
go run *.go ${@:1}