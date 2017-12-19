'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assign = exports.register = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientRedis = require('./Client.Redis');

var register = exports.register = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(socket) {
    var _SCClientInfo, client, registeredClient;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            /* Lendo o Cookie */
            _SCClientInfo = socket.request.headers.cookie._SCClientInfo;
            client = JSON.parse(_SCClientInfo);

            console.log('\n' + client.type.toUpperCase() + ' Bot: ' + client.name + ' est\xE1 online. :)'); // eslint-disable-line

            /* Criando o registro no Redis */
            _context.next = 5;
            return ClientRedis.set(client);

          case 5:
            _context.next = 7;
            return ClientRedis.get(client);

          case 7:
            registeredClient = _context.sent;

            console.log('\n' + registeredClient.type.toUpperCase() + ' Bot: ' + registeredClient.name + ' foi registrado. :)'); // eslint-disable-line
            return _context.abrupt('return', registeredClient);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function register(_x) {
    return _ref.apply(this, arguments);
  };
}();

var assign = exports.assign = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(client) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', client);

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function assign(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = {
  register: register,
  assign: assign
};
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(register, 'register', 'server/socket/Client.js');

  __REACT_HOT_LOADER__.register(assign, 'assign', 'server/socket/Client.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'server/socket/Client.js');
}();

;
//# sourceMappingURL=Client.js.map