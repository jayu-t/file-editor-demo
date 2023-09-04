const path = require("path");

module.exports = {
  entry: {
    app: "./electron/src/main/electron.ts",
    preload: "./electron/src/preload/preload.ts",
  },
  target: "electron-main",
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
