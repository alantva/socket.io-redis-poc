'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = require('socket.io'); /*  eslint no-console: 0 */

var redis = require('socket.io-redis');
var cookieParser = require('socket.io-cookie');

var UserListener = require('./User');
var CustomerListener = require('./Customer');

module.exports = function (opts) {
  var server = opts.server || null;
  var serverOpts = opts.serverOpts || {};
  var defaultOpts = {
    pingTimeout: 60000,
    pingInterval: 1000,
    serveClient: false
  };
  var ioOpts = _lodash2.default.extend({}, defaultOpts, serverOpts);
  var SocketServer = io(server, ioOpts);
  SocketServer.adapter(redis({ host: process.env.REDIS_URL, port: process.env.REDIS_PORT }));
  SocketServer.use(cookieParser);

  SocketServer.on('connection', function () {});

  var namespaces = {
    user: SocketServer.of('/user'),
    customer: SocketServer.of('/customer')
  };

  UserListener(namespaces);
  CustomerListener(namespaces);

  return SocketServer;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
}();

;
//# sourceMappingURL=index.js.map