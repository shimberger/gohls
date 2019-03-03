#!/bin/bash

cp internal/buildinfo/buildinfo.go.in internal/buildinfo/buildinfo.go
go generate github.com/shimberger/gohls/internal/api
go run *.go ${@:1}