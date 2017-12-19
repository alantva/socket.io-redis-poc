'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = exports.remove = exports.get = exports.set = undefined;

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

var get = function get(data) {
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
var set = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
    var id, name, type;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = data.id, name = data.name, type = data.type;
            return _context.abrupt('return', new Promise(function (resolve, reject) {
              Redis.hmset('w-api:' + type + ':' + id, ['id', id, 'name', name, 'type', type], function (err) {
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

  return function set(_x) {
    return _ref.apply(this, arguments);
  };
}();
var remove = function remove(data) {
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
    Redis.keys('w-api:*', function (e, keys) {
      if (e) {
        reject(e);
      } else {
        var pipeline = Redis.pipeline();
        keys.forEach(function (key) {
          pipeline.del(key);
        });
        pipeline.exec(function (err) {
          if (err) {
            reject(err);
          } else {
            console.log('Client.Redis: Redis clear!'); // eslint-disable-line
            resolve();
          }
        });
      }
    });
  });
};

exports.set = set;
exports.get = get;
exports.remove = remove;
exports.clear = clear;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Redis, 'Redis', 'server/socket/Client.Redis.js');

  __REACT_HOT_LOADER__.register(get, 'get', 'server/socket/Client.Redis.js');

  __REACT_HOT_LOADER__.register(set, 'set', 'server/socket/Client.Redis.js');

  __REACT_HOT_LOADER__.register(remove, 'remove', 'server/socket/Client.Redis.js');

  __REACT_HOT_LOADER__.register(clear, 'clear', 'server/socket/Client.Redis.js');
}();

;
//# sourceMappingURL=Client.Redis.js.map