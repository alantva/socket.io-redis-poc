/* eslint no-console: 0 */
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../webpack.config';

require('dotenv/config');

const SocketServer = require('./socket');

const app = express();
const port = process.env.PORT || 3030;
const compiler = webpack(config);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  stats: { colors: true },
}));

app.use(webpackHotMiddleware(compiler));

app.use('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

/* listen */

const server = app.listen(port, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Server running on port', port, 'on', process.env.NODE_ENV);
});

/* socket */

const MainSocketServer = new SocketServer({ server });

MainSocketServer.on('connection', (MSSocket) => {
  console.log(`\nMain Socket Bot: ${MSSocket.id} está online. :)`);

  MSSocket.on('disconnect', () => {
    console.log(`\nMain Socket Bot: ${MSSocket.id} se desconectou. :(`);
  });
});
