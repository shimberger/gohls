[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/shimberger/gohls)

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/shimberger/gohls)

# Golang HLS Streamer

[![GitHub Actions: Build, and may release a new snapshot](https://github.com/shimberger/gohls/actions/workflows/build_and_release_snapshot.yml/badge.svg)](https://github.com/shimberger/gohls/actions/workflows/build_and_release_snapshot.yml) 
[![GoDoc](https://godoc.org/github.com/shimberger/gohls?status.svg)](https://godoc.org/github.com/shimberger/gohls)  

Simple server that exposes a directory for video streaming via HTTP Live Streaming (HLS). Uses ffmpeg for transcoding.

*This project is cobbled together from all kinds of code I had lying around so it's pretty crappy all around. It also has some serious shortcomings.*

## Running it

*Important*: You need the ffmpeg and ffprobe binaries in your PATH. The server will not start without them. You can find builds most operating systems at [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html).

### 1. Download the binary for your operating system

You can find the latest release on the releases page [https://github.com/shimberger/gohls/releases](https://github.com/shimberger/gohls/releases) or just download a current snapshot:

- [Windows (64 bit)](https://s3.amazonaws.com/gohls/gohls-windows-amd64-snapshot.tar.gz)
- [Linux (64 bit)](https://s3.amazonaws.com/gohls/gohls-linux-amd64-snapshot.tar.gz)
- [Linux (32 bit)](https://s3.amazonaws.com/gohls/gohls-linux-386-snapshot.tar.gz)
- [Linux (Arm 64 bit)](https://s3.amazonaws.com/gohls/gohls-linux-arm64-snapshot.tar.gz)
- [macOS (64 bit)](https://s3.amazonaws.com/gohls/gohls-osx-snapshot.tar.gz)
- [macOS (Arm (M1) 64 bit)](https://s3.amazonaws.com/gohls/gohls-osx-arm64-snapshot.tar.gz)

### 2. Create a configuration file

The configuration is stored in JSON format. Just call the file `gohls-config.json` or whatever you like. The format is as follows:

```
{
	"folders": [
		{
			"path": "~/Videos",
			"title": "My Videos"
		},
		{
			"path": "~/Downloads",
			"title": "My Downloads"
		}
	]
}
```

This will configure which directories on your system will be made available for streaming. See the screenshot for details:

![](https://s3-eu-west-1.amazonaws.com/captured-krxvuizy1557lsmzs8mvzdj4/yd4ei-20181024-24215053.png)

### 3. Run the server

Execute the command `gohls serve -config <path-to-config>` e.g. `gohls serve -config gohls-config.json` to serve the videos specified by the config file. To make the server listen on another port or address just use the `serve` command with `--listen` like so (the example uses port 7000 on all interfaces): `gohls serve --listen :7000 -config <path-to-config>`

### 4. Open a web browser

Visit the URL [http://127.0.0.1:8080](http://127.0.0.1:8080) to access the web interface.

## Contributing

### Requirements

- [go installed](https://golang.org/dl/)
- [npm installed](https://nodejs.org/en/) *(NPM is part of Node.js)*
- bash

### Initial setup

1. Clone the repository `git@github.com:shimberger/gohls.git`
2. Build frontend `cd ui/ && npm install && npm run build && cd ..`

### Running server

To then run the development server execute: `./scripts/run.sh serve`

## License

See [LICENSE.txt](https://github.com/shimberger/gohls/blob/master/LICENSE.txt)
