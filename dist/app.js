'use strict';

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

SS.on('connection', function (socket) {
  console.log('\nBot: ' + socket.id + ' est\xE1 online. :)');

  socket.on('disconnect', function () {
    console.log('\nBot: ' + socket.id + ' se desconectou. :(');
  });
});

var namespaceSender = SS.of('/sender');
var namespaceReceiver = SS.of('/receiver');

namespaceReceiver.on('connection', function (socket) {
  console.log('\nReceiver Bot: ' + socket.id + ' est\xE1 online. :)', process.pid);
});

namespaceSender.on('connection', function (socket) {
  console.log('\nSender Bot: ' + socket.id + ' est\xE1 online. :)', process.pid);

  socket.on('message', function (data) {
    console.log('\nSocket Bot: ' + data.name + ' enviou uma mensagem.');
    namespaceReceiver.emit('message', data);
  });
});
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

  __REACT_HOT_LOADER__.register(namespaceSender, 'namespaceSender', 'server/app.js');

  __REACT_HOT_LOADER__.register(namespaceReceiver, 'namespaceReceiver', 'server/app.js');
}();

;
//# sourceMappingURL=app.js.map