/*  eslint no-console: 0 */
import _ from 'lodash';

const io = require('socket.io');
const redis = require('socket.io-redis');
const cookieParser = require('socket.io-cookie');

const User = require('./User');
const Customer = require('./Customer');

module.exports = (opts) => {
  const server = opts.server || null;
  const serverOpts = opts.serverOpts || {};
  const defaultOpts = {
    pingTimeout: 60000,
    pingInterval: 1000,
    serveClient: false,
  };
  const ioOpts = _.extend({}, defaultOpts, serverOpts);
  const SocketServer = io(server, ioOpts);
  SocketServer.adapter(redis({ host: process.env.REDIS_URL, port: process.env.REDIS_PORT }));
  SocketServer.use(cookieParser);

  SocketServer.on('connection', () => {});

  const namespaceUser = SocketServer.of('/user');
  const namespaceCustomer = SocketServer.of('/customer');

  User(namespaceUser, namespaceCustomer);
  Customer(namespaceCustomer, namespaceUser);

  return SocketServer;
};
