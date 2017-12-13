require('dotenv/config');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distFolder = path.resolve(__dirname, './dist');
const srcFolder = path.resolve(__dirname, './src');
const port = process.env.PORT.toString();

module.exports = {
  entry: {
    bundle: [
      'babel-polyfill',
      'react-hot-loader/patch',
      `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
      path.resolve(srcFolder, './main'),
    ],
  },
  output: {
    path: distFolder,
    publicPath: `http://localhost:${port}/`,
    filename: 'index.[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [{ loader: 'file-loader?hash=sha512&digest=hex&name=/[hash].[ext]' }],
      },
      {
        test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{ loader: 'file-loader?name=/fonts/[name].[ext]' }],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_URL: JSON.stringify(process.env.API_URL),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'POC - Redis + socket.io',
      filename: 'index.html',
      template: path.resolve(srcFolder, './index.html'),
      inject: true,
    }),
  ].filter(p => p),
  devtool: 'source-map',
  context: __dirname,
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css'],
  },
};
