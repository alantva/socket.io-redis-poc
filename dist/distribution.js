'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = exports.removeClient = exports.getClient = exports.setClient = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Redis = new _ioredis2.default({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL
});

var getClient = function getClient(data) {
  var id = data.id,
      type = data.type;

  return new Promise(function (resolve, reject) {
    Redis.hgetall('w-api:' + type + ':' + id, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
var setClient = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
    var id, name, type;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = data.id, name = data.name, type = data.type;
            return _context.abrupt('return', new Promise(function (resolve, reject) {
              Redis.hmset('w-api:' + type + ':' + id, 'id', id, 'name', name, function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }));

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function setClient(_x) {
    return _ref.apply(this, arguments);
  };
}();
var removeClient = function removeClient(data) {
  var id = data.id,
      type = data.type;

  return new Promise(function (resolve, reject) {
    Redis.del('w-api:' + type + ':' + id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
var clear = function clear() {
  return new Promise(function (resolve, reject) {
    Redis.keys('w-api:*', function (err, keys) {
      if (err) {
        reject(err);
      } else {
        var pipeline = Redis.pipeline();
        keys.forEach(function (key) {
          pipeline.del(key);
        });
        pipeline.exec(function (err2) {
          if (err) {
            reject(err2);
          } else {
            console.log('Distribution: Redis clear!');
            resolve();
          }
        });
      }
    });
  });
};

exports.setClient = setClient;
exports.getClient = getClient;
exports.removeClient = removeClient;
exports.clear = clear;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Redis, 'Redis', 'server/distribution.js');

  __REACT_HOT_LOADER__.register(getClient, 'getClient', 'server/distribution.js');

  __REACT_HOT_LOADER__.register(setClient, 'setClient', 'server/distribution.js');

  __REACT_HOT_LOADER__.register(removeClient, 'removeClient', 'server/distribution.js');

  __REACT_HOT_LOADER__.register(clear, 'clear', 'server/distribution.js');
}();

;
//# sourceMappingURL=distribution.js.map