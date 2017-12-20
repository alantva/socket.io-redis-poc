'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Client = require('./Client.Redis');

var _Queue = require('./Queue.Redis');

var _Client2 = require('./Client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (namespaces) {
  namespaces.customer.on('connection', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(socket) {
      var client, partner;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _Client2.saveRegister)(socket);

            case 2:
              client = _context.sent;
              _context.next = 5;
              return (0, _Queue.push)(client);

            case 5:
              _context.next = 7;
              return (0, _Client2.assignPartner)(client);

            case 7:
              partner = _context.sent;

              if (!partner) {
                _context.next = 12;
                break;
              }

              _context.next = 11;
              return (0, _Queue.remove)(client);

            case 11:

              socket.on('message', function (data) {
                console.log('\nCUSTOMER Bot: ' + client.name + ' enviou uma mensagem.'); // eslint-disable-line
                namespaces.user.to(partner.socketID).emit('message', data, function () {
                  console.log('PAU!'); // eslint-disable-line
                });
                socket.emit('message', data, function () {
                  console.log('PIRU!'); // eslint-disable-line
                });
              });

            case 12:

              socket.on('disconnect', function () {
                console.log('\nCUSTOMER Bot: ' + client.name + ' se desconectou. :('); // eslint-disable-line
                if ((0, _Client.remove)(client)) {
                  console.log('\nCUSTOMER Bot: ' + client.name + ' teve seu registro removido. :)'); // eslint-disable-line
                }
                if ((0, _Queue.remove)(client)) {
                  console.log('\nCUSTOMER Bot: ' + client.name + ' teve seu registro removido da fila. :)'); // eslint-disable-line
                }
              });

            case 13:
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
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
}();

;
//# sourceMappingURL=Customer.js.map