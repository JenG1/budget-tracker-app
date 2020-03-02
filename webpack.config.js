const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const config = {
  entry: "server.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  mode: "development",
  plugins: [new BundleAnalyzerPlugin()]
};
module.exports = config;