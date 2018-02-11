const path = require('path');

module.exports = {
  entry: './index.tsx',
  context: path.resolve(__dirname, '__fixtures__'),
  output: {
    path: path.resolve(__dirname, '__fixtures__'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
};
