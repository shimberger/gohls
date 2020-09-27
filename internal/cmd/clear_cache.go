package cmd

import (
	"github.com/shimberger/gohls/internal/hls"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(clearCacheCmd)
}

var clearCacheCmd = &cobra.Command{
	Use:   "clear-cache",
	Short: "Clears all caches and temporary files",
	Long:  `Clears all caches and temporary files`,
	Run: func(cmd *cobra.Command, args []string) {
		init_hls(dataDir)
		hls.ClearCache()
	},
}
