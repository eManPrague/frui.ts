const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const demoConfig = {
  name: "demo",
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  devServer: {
    open: true,
    hot: true,
    contentBase: "./dist",
  },
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
    alias: {
      react: path.resolve("./node_modules/react"), // if this is removed, https://reactjs.org/warnings/invalid-hook-call-warning.html happens
    },
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
};

module.exports = [demoConfig];
