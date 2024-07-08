const path = require("path");
const Dotenv = require("dotenv-webpack");
const dotenv = require("dotenv");
const webpack = require("webpack");

dotenv.config();

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new Dotenv(), // Load .env variables
    new webpack.DefinePlugin({
      "process.env.SOCKET_URL": JSON.stringify(process.env.SOCKET_URL),
      "process.env.TOKEN": JSON.stringify(process.env.TOKEN),
      "domain.env.DOMAIN": JSON.stringify(process.env.DOMAIN),
    }),
  ],
  output: {
    filename: "rtccallapi_external.js",
    path: path.resolve(__dirname, "public"),
    library: "RTCCallApiLibrary",
    libraryTarget: "var",
  },
  devServer: {
    host: "0.0.0.0",
    // contentBase: path.join(__dirname, "public"),
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 7000,
    allowedHosts: ["api.pactocoin.com/iframeapi", "api.pactocoin.com"],

    // disableHostCheck: true, // Disables host check
  },
  mode: "production",
  node: false,
};
