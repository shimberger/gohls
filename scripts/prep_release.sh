#!/bin/bash

PATH=$GOPATH/bin/:$PATH
VERSION=$1

cd ui/src && gulp && cd ../../

rm -rf build
mkdir build

go-bindata -prefix ui/build ui/build/...

function make_release() {
	NAME=$1
	GOOS=$2
	GOARCH=$3
	SUFFIX=$4
	RELEASE_PATH=build/gohls-$NAME-${VERSION}
	RELEASE_FILE=gohls-$NAME-${VERSION}.tar.gz
	mkdir $RELEASE_PATH
	cp README.md $RELEASE_PATH
	cp LICENSE.txt $RELEASE_PATH
	go build -o $RELEASE_PATH/gohls${SUFFIX} *.go
	PREV_WD=$(PWD)
	cd  $RELEASE_PATH
	tar cvfz ../$RELEASE_FILE .
	cd ../../
}

make_release "osx" "darwin" "amd64" ""
make_release "linux-amd64" "linux" "amd64" ""
make_release "windows-amd64" "windows" "amd64" ".exe"