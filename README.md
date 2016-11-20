Golang HLS Streamer
===================

Simple server that exposes a directory for video streaming via HTTP Live Streaming (HLS).
Uses ffmpeg for transcoding.

This project is cobbled together from all kinds of code I has lying around so it's pretty crappy all around.

Running it
----------

- Place ffmpeg and ffprobe binaries in "tools" dir
- Run ./gohls serve <path to videos> in project root (e.g. /gohls serve ~/Documents/)
- Access http://localhost:8080/ui/

License
-------
See LICENSE.txt