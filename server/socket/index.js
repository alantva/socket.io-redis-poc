/*  eslint no-console: 0 */
import _ from 'lodash';

const io = require('socket.io');
const redis = require('socket.io-redis');
const cookieParser = require('socket.io-cookie');

const UserListener = require('./User');
const CustomerListener = require('./Customer');

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

  const namespaces = {
    user: SocketServer.of('/user'),
    customer: SocketServer.of('/customer'),
  };

  UserListener(namespaces);
  CustomerListener(namespaces);

  return SocketServer;
};
