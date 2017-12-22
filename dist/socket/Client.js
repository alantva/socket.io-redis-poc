'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignToRoom = exports.assignPartners = exports.recoverRegister = exports.saveRegister = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Client = require('./Client.Redis');

var _Queue = require('./Queue.Redis');

var _Room = require('./Room.Redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saveRegister = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(socket) {
    var _SCClientInfo, client;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            /* Lendo o Cookie */
            _SCClientInfo = socket.request.headers.cookie._SCClientInfo;
            client = JSON.parse(_SCClientInfo);
            /* Criando o registro no Redis */

            client.socketID = socket.id;
            _context.next = 6;
            return (0, _Client.set)(client);

          case 6:
            console.log('\n' + client.type.toUpperCase() + ' BOT: ' + client.name + ' foi registrado. :)'); // eslint-disable-line
            return _context.abrupt('return', client);

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);

            console.error('Client.saveRegister', _context.t0);
            return _context.abrupt('return', null);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 10]]);
  }));

  return function saveRegister(_x) {
    return _ref.apply(this, arguments);
  };
}();

var recoverRegister = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(client) {
    var recoveredClient;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _Client.get)(client);

          case 3:
            recoveredClient = _context2.sent;

            console.log('\n' + recoveredClient.type.toUpperCase() + ' BOT: ' + recoveredClient.name + ' foi recuperado. :)'); // eslint-disable-line
            return _context2.abrupt('return', recoveredClient);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);

            console.error('Client.recoverRegister', _context2.t0);
            return _context2.abrupt('return', null);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 8]]);
  }));

  return function recoverRegister(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var assignPartners = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(client) {
    var id, type, partner;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            id = void 0;
            type = void 0;
            _context3.t0 = client.type;
            _context3.next = _context3.t0 === 'user' ? 6 : _context3.t0 === 'customer' ? 11 : 16;
            break;

          case 6:
            type = 'customer';
            _context3.next = 9;
            return (0, _Queue.pop)({ type: type });

          case 9:
            id = _context3.sent;
            return _context3.abrupt('break', 16);

          case 11:
            type = 'user';
            _context3.next = 14;
            return (0, _Queue.pop)({ type: type });

          case 14:
            id = _context3.sent;
            return _context3.abrupt('break', 16);

          case 16:
            if (id) {
              _context3.next = 18;
              break;
            }

            return _context3.abrupt('return', null);

          case 18:
            _context3.next = 20;
            return recoverRegister({ id: id, type: type });

          case 20:
            partner = _context3.sent;
            return _context3.abrupt('return', partner);

          case 24:
            _context3.prev = 24;
            _context3.t1 = _context3['catch'](0);

            console.error('Client.assignClient', _context3.t1);
            return _context3.abrupt('return', null);

          case 28:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 24]]);
  }));

  return function assignPartners(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var assignToRoom = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(clients) {
    var roomID;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return (0, _Room.set)({ clients: clients });

          case 3:
            roomID = _context4.sent;
            _context4.next = 6;
            return Promise.all(clients.map(function (client) {
              client.roomID = roomID; // eslint-disable-line
              return (0, _Client.set)(client);
            }));

          case 6:
            return _context4.abrupt('return', { roomID: roomID });

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4['catch'](0);

            console.error('Client.assignToRoom', _context4.t0);
            return _context4.abrupt('return', false);

          case 13:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[0, 9]]);
  }));

  return function assignToRoom(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.saveRegister = saveRegister;
exports.recoverRegister = recoverRegister;
exports.assignPartners = assignPartners;
exports.assignToRoom = assignToRoom;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(saveRegister, 'saveRegister', 'server/socket/Client.js');

  __REACT_HOT_LOADER__.register(recoverRegister, 'recoverRegister', 'server/socket/Client.js');

  __REACT_HOT_LOADER__.register(assignPartners, 'assignPartners', 'server/socket/Client.js');

  __REACT_HOT_LOADER__.register(assignToRoom, 'assignToRoom', 'server/socket/Client.js');
}();

;
//# sourceMappingURL=Client.js.map