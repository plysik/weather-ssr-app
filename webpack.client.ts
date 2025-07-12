const clientPath = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/client/index.tsx',
  devtool: 'source-map',
  output: {
    path: clientPath.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@components': clientPath.resolve(__dirname, 'src/components'),
      '@/lib': clientPath.resolve(__dirname, 'src/components/lib'),
      '@': clientPath.resolve(__dirname, 'src'),
      
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      // przekazujemy tylko to, co potrzebuje frontend:
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    })
  ], module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  }
};
