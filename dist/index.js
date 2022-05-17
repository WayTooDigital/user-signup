'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var express = require('express');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var nacl = require('tweetnacl');
var naclUtil = require('tweetnacl-util');
var bs58 = require('bs58');
var jwt = require('jsonwebtoken');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var mongoose__default = /*#__PURE__*/_interopDefaultLegacy(mongoose);
var nacl__default = /*#__PURE__*/_interopDefaultLegacy(nacl);
var naclUtil__default = /*#__PURE__*/_interopDefaultLegacy(naclUtil);
var bs58__default = /*#__PURE__*/_interopDefaultLegacy(bs58);
var jwt__default = /*#__PURE__*/_interopDefaultLegacy(jwt);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var _excluded$1 = ["_id", "createdAt", "updatedAt"];
var Schema$1 = mongoose__default["default"].Schema;
var nonceSchema = new Schema$1({
  nonce: {
    type: Number
  },
  walletAddress: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: function transform(doc, ret) {
      ret._id;
          ret.createdAt;
          ret.updatedAt;
          var obj = _objectWithoutProperties(ret, _excluded$1);

      return obj;
    }
  }
});
var NonceModel = mongoose__default["default"].model("Nonce", nonceSchema, "nonces");

var router$2 = express__default["default"].Router();

var generateNonce = function generateNonce() {
  return Math.floor(Math.random() * 1000000);
}; // Add new Nonce


router$2.post("/", expressValidator.body(["walletAddress"]).not().isEmpty(), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var errors, nonce, _nonce;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            errors = expressValidator.validationResult(req);

            if (errors.isEmpty()) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.status(400).json({
              errors: errors.array()
            }));

          case 3:
            _context.next = 5;
            return NonceModel.findOneAndUpdate({
              walletAddress: req.body.walletAddress
            }, {
              nonce: generateNonce()
            }, {
              "new": true
            });

          case 5:
            nonce = _context.sent;

            if (!nonce) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", res.status(200).send(nonce));

          case 8:
            _context.prev = 8;
            _context.next = 11;
            return new NonceModel({
              walletAddress: req.body.walletAddress,
              nonce: generateNonce()
            }).save();

          case 11:
            _nonce = _context.sent;
            return _context.abrupt("return", res.status(201).send(_nonce));

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](8);
            console.log(_context.t0);
            return _context.abrupt("return", res.status(400).send({
              message: "There was an error saving data"
            }));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 15]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var _excluded = ["_id", "createdAt", "updatedAt"];
var Schema = mongoose__default["default"].Schema;
var userSchema = new Schema({
  walletAddress: {
    type: String,
    required: "{PATH} is required!"
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: function transform(doc, ret) {
      ret._id;
          ret.createdAt;
          ret.updatedAt;
          var obj = _objectWithoutProperties(ret, _excluded);

      return obj;
    }
  }
});
var UserModel = mongoose__default["default"].model("User", userSchema, "users");

var router$1 = express__default["default"].Router();

var generateToken = function generateToken(user) {
  return jwt__default["default"].sign({
    id: user._id
  }, global.config.jwt_secret, {
    expiresIn: "15d" // expires in 15 days

  });
}; // Add new User


router$1.post("/", expressValidator.body(["message", "signedMessage"]).not().isEmpty(), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _$exec, _$exec2;

    var errors, walletAddress, nonce_str, nonce, verified, user, _user;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            errors = expressValidator.validationResult(req);

            if (errors.isEmpty()) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.status(400).json({
              errors: errors.array()
            }));

          case 3:
            walletAddress = ((_$exec = /Wallet address: ([a-zA-Z0-9]*)/.exec(req.body.message)) !== null && _$exec !== void 0 ? _$exec : Array(1))[1];
            nonce_str = ((_$exec2 = /Nonce: ([0-9]*)/.exec(req.body.message)) !== null && _$exec2 !== void 0 ? _$exec2 : Array(1))[1];

            if (walletAddress) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.status(400).send({
              message: "Wallet address is missing"
            }));

          case 7:
            if (nonce_str) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", res.status(400).send({
              message: "Nonce is missing"
            }));

          case 9:
            _context.next = 11;
            return NonceModel.findOne({
              walletAddress: walletAddress,
              nonce: nonce_str
            });

          case 11:
            nonce = _context.sent;

            if (nonce) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", res.status(400).send({
              message: "Can't verify nonce"
            }));

          case 14:
            _context.prev = 14;
            verified = nacl__default["default"].sign.detached.verify(naclUtil__default["default"].decodeUTF8(req.body.message), Uint8Array.from(req.body.signedMessage), bs58__default["default"].decode(walletAddress));
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](14);
            return _context.abrupt("return", res.status(400).send({
              message: _context.t0.message
            }));

          case 21:
            if (verified) {
              _context.next = 23;
              break;
            }

            return _context.abrupt("return", res.status(400).send({
              message: "Can't verify signature and message"
            }));

          case 23:
            _context.next = 25;
            return NonceModel.deleteOne({
              walletAddress: walletAddress,
              nonce: nonce_str
            });

          case 25:
            _context.next = 27;
            return UserModel.findOne({
              walletAddress: walletAddress
            });

          case 27:
            user = _context.sent;

            if (!user) {
              _context.next = 30;
              break;
            }

            return _context.abrupt("return", res.status(200).send({
              token: generateToken(user)
            }));

          case 30:
            _context.prev = 30;
            _context.next = 33;
            return new UserModel({
              walletAddress: walletAddress
            }).save();

          case 33:
            _user = _context.sent;
            return _context.abrupt("return", res.status(201).send({
              token: generateToken(_user)
            }));

          case 37:
            _context.prev = 37;
            _context.t1 = _context["catch"](30);
            return _context.abrupt("return", res.status(400).send({
              message: "There was an error saving data"
            }));

          case 40:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[14, 18], [30, 37]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var _global$config, _global$config2, _global$config3, _global$config4, _global$config5;
var connectionString = (_global$config = global.config) === null || _global$config === void 0 ? void 0 : _global$config.db_protocol;

if ((_global$config2 = global.config) !== null && _global$config2 !== void 0 && _global$config2.db_user && (_global$config3 = global.config) !== null && _global$config3 !== void 0 && _global$config3.db_pass) {
  connectionString += "".concat(global.config.db_user, ":").concat(global.config.db_pass, "@");
}

connectionString += "".concat((_global$config4 = global.config) === null || _global$config4 === void 0 ? void 0 : _global$config4.db_host, "/").concat((_global$config5 = global.config) === null || _global$config5 === void 0 ? void 0 : _global$config5.db_name, "?retryWrites=true&w=majority"); // DB Connection

var connectDb = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              mongoose__default["default"].connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
              }, function (err, res) {
                if (err) {
                  console.log("Couldn't connect to database", err.code, err.input);
                  reject(err);
                } else {
                  resolve(res.connections[0]);
                }
              });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function connectDb() {
    return _ref.apply(this, arguments);
  };
}();

connectDb();
var router = express__default["default"].Router();
router.use('/nonces', router$2);
router.use('/users', router$1);

exports.router = router;
//# sourceMappingURL=index.js.map
