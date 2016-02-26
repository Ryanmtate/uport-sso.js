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
  function uPortID(_identifier) {
    var _apiEndpoint = arguments.length <= 1 || arguments[1] === undefined ? _utils.apiEndpoint : arguments[1];

    _classCallCheck(this, uPortID);

    this._api = new _api2.default(_identifier, _apiEndpoint);
    this._identifier = _identifier;

    return this;
  }

  _createClass(uPortID, [{
    key: 'register',
    value: function register(_password) {
      return this._api.signup({ email: this._identifier, password: _password });
    }
  }, {
    key: 'confirm',
    value: function confirm(_emailToken) {
      return this._api.confirm({ token: _emailToken });
    }
  }, {
    key: 'resend',
    value: function resend() {
      return this._api.resend();
    }
  }, {
    key: 'login',
    value: function login(_password) {
      return this._api.signin({ email: this._identifier, password: _password });
    }
  }, {
    key: 'get',
    value: function get(_token) {
      return this._api.get(_token);
    }
  }, {
    key: 'generate',
    value: function generate(_token, _password, _seed, _entropy) {
      var _this = this;

      return this._api.get(_token).then(function (_json) {
        if (_json.keystore !== null) {
          throw new Error('KeyStore already generated');
        }

        return (0, _utils.generateAddress)(_password, _seed, _entropy).then(function (keystore) {
          return _this._api.update(_token, { keystore: keystore });
        });
      });
    }
  }, {
    key: 'migrate',
    value: function migrate(_token, _password, _seed) {
      return this.generate(_token, _password, _seed, '');
    }
  }, {
    key: 'remove',
    value: function remove(_token) {
      return this._api.remove(_token);
    }
  }]);

  return uPortID;
}();

exports.default = uPortID;