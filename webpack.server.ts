const serverPath = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: './src/server/index.tsx',
  output: {
    path: serverPath.resolve(__dirname, 'build'),
    filename: 'server.js'
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@components': serverPath.resolve(__dirname, 'src/components'),
      '@/lib': serverPath.resolve(__dirname, 'src/components/lib'),
      '@': serverPath.resolve(__dirname, 'src'),
    }
  },
  module: {
    rules: [
      { test: /\.(ts|tsx)$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  }
};
