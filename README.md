# Golang HLS Streamer

Simple server that exposes a directory for video streaming via HTTP Live Streaming (HLS). Uses ffmpeg for transcoding.

*This project is cobbled together from all kinds of code I has lying around so it's pretty crappy all around. It also has some serious shortcomings.*

## Running it
*Important*: You need the ffmpeg and ffrpobe binaries in your PATH. The server will not start without them. You can find builds most operating systems at https://ffmpeg.org/download.html. 

1. Download the binary for your operating system from the releases page (https://github.com/shimberger/golang-hls/releases)
2. Execute the command `gohls serve <path to videos>` e.g. `gohls serve ~/Documents/Videos` to serve the videos located in `~/Documents/Videos`.
3. Visit the URL http://localhost:8080 to access the web interface

## Developing it
Just do a `go get /github.com/shimberger/golang-hls/...` in your GOPATH. Then change into the project directory and run the development server by executing `./scripts/run_dev` (sorry Windows users). You need gulp & npm to build the frontend.

## License

See LICENSE.txt