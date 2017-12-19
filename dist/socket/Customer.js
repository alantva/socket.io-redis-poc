'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientRedis = require('./Client.Redis');
var Client = require('./Client');

module.exports = function (namespaceCustomer, namespaceUser) {
  namespaceCustomer.on('connection', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(socket) {
      var client;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return Client.register(socket);

            case 2:
              client = _context.sent;


              socket.on('message', function (data) {
                console.log('\nCUSTOMER Bot: ' + client.name + ' enviou uma mensagem.'); // eslint-disable-line
                namespaceUser.emit('message', data);
                socket.emit('message', data);
              });

              socket.on('disconnect', function () {
                console.log('\nCUSTOMER Bot: ' + client.name + ' se desconectou. :('); // eslint-disable-line
                if (ClientRedis.remove(client)) {
                  console.log('\nCUSTOMER Bot: ' + client.name + ' teve seu registro removido. :)'); // eslint-disable-line
                }
              });

            case 5:
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