'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uPortID = function () {
  function uPortID(identifier) {
    var _apiEndpoint = arguments.length <= 1 || arguments[1] === undefined ? _utils.apiEndpoint : arguments[1];

    _classCallCheck(this, uPortID);

    this._api = new _api2.default(identifier, _apiEndpoint);
    this._identifier = identifier;
    this._json = null;
  }

  _createClass(uPortID, [{
    key: 'login',
    value: function login(_password) {
      var _this = this;

      return (0, _utils.getToken)(this._identifier, _password).then(function (_token) {
        return _this._api.get(_token);
      });
    }
  }, {
    key: 'register',
    value: function register(_password) {
      var _this2 = this;

      return (0, _utils.generateIdentity)(this._identifier, _password).then(function (_json) {
        return _this2._api.put(_json);
      });
    }
  }, {
    key: 'confirm',
    value: function confirm(_password, _secret) {
      var _this3 = this;

      return (0, _utils.getToken)(this._identifier, _password).then(function (_token) {
        return _this3._api.post({ token: _token, secret: _secret });
      });
    }
  }, {
    key: 'generate',
    value: function generate(_password, _seed, _entropy) {
      var _this4 = this;

      return (0, _utils.getToken)(this._identifier, _password).then(function (_token) {
        return _this4._api.get(_token);
      }).then(function (_json) {
        if (_json.keystore !== null) {
          throw new Error('Keysore already generated');
        }

        return (0, _utils.generateAddress)(_password, _seed, _entropy).then(function (keystore) {
          return Object.assign({}, _json, { keystore: keystore });
        });
      }).then(function (_json) {
        return _this4._api.post(_json);
      });
    }
  }, {
    key: 'migrate',
    value: function migrate(_password, _seed) {
      return this.generate(_password, _seed, '');
    }
  }, {
    key: 'remove',
    value: function remove(_password) {
      var _this5 = this;

      return (0, _utils.getToken)(this._identifier, _password).then(function (_token) {
        return _this5._api.remove(_token);
      });
    }
  }, {
    key: 'json',
    set: function set(value) {
      this._json = value;
    },
    get: function get() {
      return this._json;
    }
  }]);

  return uPortID;
}();

exports.default = uPortID;