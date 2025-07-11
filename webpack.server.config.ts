import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
const nodeExternals = require('webpack-node-externals');


/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './server/index.tsx',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: [nodeExternals()], // nie bundlujemy node_modules
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'server/template.html'),
          to: path.resolve(__dirname, 'dist/template.html')
        }
      ]
    })
  ]
};
