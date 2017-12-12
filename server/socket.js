/*  eslint no-console: 0 */
import _ from 'lodash';

const io = require('socket.io');

module.exports = (opts) => {
  const server = opts.server || null;
  const serverOpts = opts.serverOpts || {};
  const defaultOpts = {
    pingTimeout: 60000,
    pingInterval: 25000,
    serveClient: false,
  };
  const ioOpts = _.extend({}, defaultOpts, serverOpts);
  const SocketServer = io(server, ioOpts);
  return SocketServer;
};
