const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const frameworkConfig = {
  name: 'framework',
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

const demoConfig = {
  name: 'demo',
  mode: 'development',
  entry: './demo/index.tsx',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    hot: true,
    contentBase: './demo'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@demo': path.resolve(__dirname, 'demo/')
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/demo')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'demo/index.html'
    })
  ]
};

module.exports = [frameworkConfig, demoConfig];