#!/bin/bash

VERSION=$1

cd assets && gulp && cd ..

rm -rf build
mkdir build

function make_release() {
	NAME=$1
	GOOS=$2
	GOARCH=$3
	VERSION=$4
	RELEASE_PATH=build/gohls-$NAME-${VERSION}
	RELEASE_FILE=gohls-$NAME-${VERSION}.tar.gz
	mkdir $RELEASE_PATH
	mkdir $RELEASE_PATH/tools
	mkdir $RELEASE_PATH/cache
	cp README.md $RELEASE_PATH
	cp LICENSE.txt $RELEASE_PATH
	cp -r dist/ui $RELEASE_PATH
	cp dist/tools/*.md $RELEASE_PATH/tools/
	cp dist/cache/*.md $RELEASE_PATH/cache/
	go build -o $RELEASE_PATH/gohls *.go
	PREV_WD=$(PWD)
	cd  $RELEASE_PATH
	tar cvfz ../$RELEASE_FILE .
	cd ../../
}

make_release "osx" "darwin" "amd64" $VERSION
make_release "linux-amd64" "linux" "amd64" $VERSION
make_release "windows-amd64" "windows" "amd64" $VERSION