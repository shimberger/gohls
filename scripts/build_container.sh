#!/bin/bash

cd ui/src && npm run build && cd ../../

export GOOS=linux
export GOARCH=amd64

go-bindata -prefix ui/build ui/build/...