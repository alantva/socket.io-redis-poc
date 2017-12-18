/* eslint no-console: 0 */
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../webpack.config';

require('dotenv/config');

const SocketServer = require('./socket');
const distribution = require('./distribution');

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

const SS = new SocketServer({ server });

if (process.env.pm_id === '0') {
  distribution.clear();
}

SS.on('connection', () => {});
const namespaceUser = SS.of('/user');
const namespaceCustomer = SS.of('/customer');

namespaceUser.on('connection', async (socket) => {
  /* Lendo o Cookie */
  const { _SCClientInfo } = socket.request.headers.cookie;
  const clientInfo = JSON.parse(_SCClientInfo);
  console.log(`\nUser Bot: ${clientInfo.name} está online. :)`);

  /* Criando o registro no Redis */
  await distribution.setClient(clientInfo);
  const User = await distribution.getClient(clientInfo);
  console.log(`\nUser Bot: ${User.name} foi registrado. :)`);

  socket.on('message', (data) => {
    console.log(`\nUser Bot: ${data.name} enviou uma mensagem.`);
    namespaceCustomer.emit('message', data);
    socket.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log(`\nUser Bot: ${User.name} se desconectou. :(`);
    if (distribution.removeClient(clientInfo)) {
      console.log(`\nUser Bot: ${User.name} teve seu registro removido. :)`);
    }
  });
});

namespaceCustomer.on('connection', async (socket) => {
  /* Lendo o Cookie */
  const { _SCClientInfo } = socket.request.headers.cookie;
  const clientInfo = JSON.parse(_SCClientInfo);
  console.log(`\nCustomer Bot: ${clientInfo.name} está online. :)`);

  /* Criando o registro no Redis */
  await distribution.setClient(clientInfo);
  const Customer = await distribution.getClient(clientInfo);
  console.log(`\nCustomer Bot: ${Customer.name} foi registrado. :)`);

  socket.on('message', (data) => {
    console.log(`\nCustomer Bot: ${data.name} enviou uma mensagem.`);
    namespaceUser.emit('message', data);
    socket.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log(`\nCustomer Bot: ${Customer.name} se desconectou. :(`);
    if (distribution.removeClient(clientInfo)) {
      console.log(`\nCustomer Bot: ${Customer.name} teve seu registro removido. :)`);
    }
  });
});
