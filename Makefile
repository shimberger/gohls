VERSION := v0.3.3
NAME := gohls
BUILDSTRING := $(shell git log --pretty=format:'%h' -n 1)
VERSIONSTRING := $(NAME) version $(VERSION)+$(BUILDSTRING)

detected_OS := $(shell sh -c 'uname -s 2>/dev/null || echo not')
ifeq ($(detected_OS),Darwin)
    BUILDDATE := $(shell date -u  +%Y-%m-%d)
else
	BUILDDATE := $(shell date -u -Iseconds)
endif

OUTPUT = dist/$(NAME)-$(shell dpkg --print-architecture)-$(shell uname -s | awk '{print tolower($$0)}')
LDFLAGS := "-X \"main.VERSION=$(VERSIONSTRING)\" -X \"main.BUILDDATE=$(BUILDDATE)\""

default: build

.PHONY: build
## Build a development binary
build:
	@mkdir -p dist/
	go build -o $(OUTPUT) -ldflags=$(LDFLAGS)

.PHONY: build_release
## Build the release binaries and save them to ./dist
build_release: clean ui bindata
	gox -arch="amd64" -os="windows darwin linux" -output="dist/$(NAME)-{{.Arch}}-{{.OS}}" -ldflags=$(LDFLAGS)

.PHONY: clean
## Remove the release folder
clean:
	rm -rf dist/
	rm -rf ui/build
	rm -rf bindata.go

.PHONY: tag
## Tag the project with the current version and push to GitHub
tag:
	git tag $(VERSION)
	git push origin --tags

## Compress the binaries
upx:
	cd dist/ && upx *

## Create artifacts
bindata:
	go-bindata -prefix ui/build ui/build/...

.PHONY: ui
## Build UI
ui:
	cd ui/src && npm run build && cd -

.PHONY: run
## Run the server
run:
	DEBUG=true go run *.go serve /tmp/videos
