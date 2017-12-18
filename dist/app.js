'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _webpack3 = require('../webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-console: 0 */
require('dotenv/config');

var SocketServer = require('./socket');
var distribution = require('./distribution');

var app = (0, _express2.default)();
var port = process.env.PORT || 3030;
var compiler = (0, _webpack2.default)(_webpack4.default);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((0, _webpackDevMiddleware2.default)(compiler, {
  publicPath: _webpack4.default.output.publicPath,
  historyApiFallback: true,
  stats: { colors: true }
}));

app.use((0, _webpackHotMiddleware2.default)(compiler));

app.use('*', function (req, res) {
  res.sendFile(_path2.default.resolve('dist/index.html'));
});

/* listen */

var server = app.listen(port, function (err) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Server running on port', port, 'on', process.env.NODE_ENV);
});

/* socket */

var SS = new SocketServer({ server: server });

if (process.env.pm_id === '0') {
  distribution.clear();
}

SS.on('connection', function () {});
var namespaceUser = SS.of('/user');
var namespaceCustomer = SS.of('/customer');

namespaceUser.on('connection', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(socket) {
    var _SCClientInfo, clientInfo, User;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            /* Lendo o Cookie */
            _SCClientInfo = socket.request.headers.cookie._SCClientInfo;
            clientInfo = JSON.parse(_SCClientInfo);

            console.log('\nUser Bot: ' + clientInfo.name + ' est\xE1 online. :)');

            /* Criando o registro no Redis */
            _context.next = 5;
            return distribution.setClient(clientInfo);

          case 5:
            _context.next = 7;
            return distribution.getClient(clientInfo);

          case 7:
            User = _context.sent;

            console.log('\nUser Bot: ' + User.name + ' foi registrado. :)');

            socket.on('message', function (data) {
              console.log('\nUser Bot: ' + data.name + ' enviou uma mensagem.');
              namespaceCustomer.emit('message', data);
              socket.emit('message', data);
            });

            socket.on('disconnect', function () {
              console.log('\nUser Bot: ' + User.name + ' se desconectou. :(');
              if (distribution.removeClient(clientInfo)) {
                console.log('\nUser Bot: ' + User.name + ' teve seu registro removido. :)');
              }
            });

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

namespaceCustomer.on('connection', function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(socket) {
    var _SCClientInfo, clientInfo, Customer;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            /* Lendo o Cookie */
            _SCClientInfo = socket.request.headers.cookie._SCClientInfo;
            clientInfo = JSON.parse(_SCClientInfo);

            console.log('\nCustomer Bot: ' + clientInfo.name + ' est\xE1 online. :)');

            /* Criando o registro no Redis */
            _context2.next = 5;
            return distribution.setClient(clientInfo);

          case 5:
            _context2.next = 7;
            return distribution.getClient(clientInfo);

          case 7:
            Customer = _context2.sent;

            console.log('\nCustomer Bot: ' + Customer.name + ' foi registrado. :)');

            socket.on('message', function (data) {
              console.log('\nCustomer Bot: ' + data.name + ' enviou uma mensagem.');
              namespaceUser.emit('message', data);
              socket.emit('message', data);
            });

            socket.on('disconnect', function () {
              console.log('\nCustomer Bot: ' + Customer.name + ' se desconectou. :(');
              if (distribution.removeClient(clientInfo)) {
                console.log('\nCustomer Bot: ' + Customer.name + ' teve seu registro removido. :)');
              }
            });

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(app, 'app', 'server/app.js');

  __REACT_HOT_LOADER__.register(port, 'port', 'server/app.js');

  __REACT_HOT_LOADER__.register(compiler, 'compiler', 'server/app.js');

  __REACT_HOT_LOADER__.register(server, 'server', 'server/app.js');

  __REACT_HOT_LOADER__.register(SS, 'SS', 'server/app.js');

  __REACT_HOT_LOADER__.register(namespaceUser, 'namespaceUser', 'server/app.js');

  __REACT_HOT_LOADER__.register(namespaceCustomer, 'namespaceCustomer', 'server/app.js');
}();

;
//# sourceMappingURL=app.js.map