//go:generate go install -v -i github.com/jteeuwen/go-bindata/go-bindata
//go:generate go-bindata -prefix ui/build ui/build/...
package main

import _ "github.com/jteeuwen/go-bindata"
