var path = require('path');
var webpack = require('webpack');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: {
    app: './src/index.js',
    vendor: ['scrypt', 'eth-lightwallet', 'node-fetch'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'uport-sso.min.js',
    // libraryTarget: 'umd',
    libraryTarget: 'commonjs',
    library: 'uPortSSO',
  },
  externals: {
    scrypt: 'scrypt',
    'eth-lightwallet': 'eth-lightwallet',
    'node-fetch': 'fetch',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  target: 'web',
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
      'node-fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     warnings: false,
    //   },
    //   output: {
    //     comments: false,
    //   },
    //   sourceMap: false,
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
  resolveLoader: {
    fallback: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        include: path.join(__dirname, 'src'),
        query: {
          presets: ['es2015', 'stage-0'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
};
