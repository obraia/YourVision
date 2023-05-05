const { merge } = require("webpack-merge");
const commonConfig = require("./common");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = merge(commonConfig, {
  mode: "development",
  devServer: {
    historyApiFallback: true,
    compress: true,
    host: "0.0.0.0",
    hot: true, // enable HMR on the server
    open: true,
    // These headers enable the cross origin isolation state
    // needed to enable use of SharedArrayBuffer for ONNX 
    // multithreading. 
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
    },
    proxy: {
      '/api/**': {
        target: 'http://127.0.0.1:5000',
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Connection: 'keep-alive',
        },
      }
    },
  },
  devtool: "cheap-module-source-map",
  plugins: [new ReactRefreshPlugin()],
});
