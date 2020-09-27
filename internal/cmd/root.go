package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

var (
	cfgFile string
	dataDir string
)

func init() {
	dataDirDefault := ".gohls-data"
	cacheDir, err := os.UserCacheDir()
	if err != nil {
		dataDirDefault = filepath.Join(cacheDir, dataDirDefault)
	}
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "./gohls-config.json", "config file (default is ./gohls-config.json)")
	rootCmd.PersistentFlags().StringVar(&dataDir, "data-dir", dataDirDefault, "config file (default is '.gohls-data' in your user cache dir or current directory if no cache dir is configured)")
}

var rootCmd = &cobra.Command{
	Use:   "gohls",
	Short: "GoHLS is a simple HTTP video streaming server",
	Long:  `GoHLS is a simple HTTP video streaming server`,
	Run: func(cmd *cobra.Command, args []string) {
		// Do Stuff Here
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
