const path = require("path");

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
  output: {
    filename: "rtccallapi_external.js",
    path: path.resolve(__dirname, "public"),
    library: "RTCCallApiLibrary",
    libraryTarget: "var",
  },
  devServer: {
    // contentBase: path.join(__dirname, "public"),
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 7000,
  },
  mode: "production",
  node: false,
};
