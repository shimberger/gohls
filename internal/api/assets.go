//go:generate go install -v -i github.com/jteeuwen/go-bindata/go-bindata
//go:generate go-bindata -pkg api -prefix ../../ui/build ../../ui/build/...
package api

import _ "github.com/jteeuwen/go-bindata"
