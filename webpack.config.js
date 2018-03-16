const path = require('path');

module.exports = {
  mode: 'development',
  entry: { index: './lib/index.js' },
  output: {
    filename: '[name].js',
    library: 'ariaExtensions',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'build'),
  },
  devtool: 'eval-source-map',
  devServer: {
    inline: false,
    publicPath: '/build',
  },
};
