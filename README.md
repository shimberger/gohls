# Golang HLS Streamer

Simple server that exposes a directory for video streaming via HTTP Live Streaming (HLS). Uses ffmpeg for transcoding.

*This project is cobbled together from all kinds of code I has lying around so it's pretty crappy all around. It also has some serious shortcomings.*

## Snapshots

* [Windows (64 bit)](https://s3.amazonaws.com/gohls/gohls-windows-amd64-snapshot.tar.gz)
* [Linux (64 bit)](https://s3.amazonaws.com/gohls/gohls-linux-amd64-snapshot.tar.gz)
* [macOS (64 bit)](https://s3.amazonaws.com/gohls/gohls-osx-snapshot.tar.gz)

## Running it

*Important*: You need the ffmpeg and ffrpobe binaries in your PATH. The server will not start without them. You can find builds most operating systems at https://ffmpeg.org/download.html.

1. Download the binary for your operating system from the releases page (https://github.com/shimberger/gohls/releases)
2. Execute the command `gohls serve <path to videos>` e.g. `gohls serve ~/Documents/Videos` to serve the videos located in `~/Documents/Videos`.
3. Visit the URL http://localhost:8080 to access the web interface

## Specifying the port

To make the server listen on another port just use the `serve` command with `--port` like so (the example uses port 7000):

	gohls serve --port 7000 <path to videos>

## Developing it

Just do a `go get /github.com/shimberger/golhls/...` in your GOPATH. Then change into the project directory and run the development server by executing `./scripts/run_dev` (sorry Windows users). You need gulp & npm to build the frontend.

## License

See LICENSE.txt