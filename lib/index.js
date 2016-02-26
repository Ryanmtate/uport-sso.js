'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uPortSSO = function () {
  function uPortSSO() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var email = _ref.email;
    var token = _ref.token;
    var _ref$url = _ref.url;
    var url = _ref$url === undefined ? _utils.apiEndpoint : _ref$url;

    _classCallCheck(this, uPortSSO);

    if (email) {
      this._identifier = email;
    }

    if (token) {
      this._token = token;
    }

    this._api = new _api2.default(this._identifier, url);

    return this;
  }

  _createClass(uPortSSO, [{
    key: 'register',
    value: function register(_email, _password) {
      var _this = this;

      if (_email && (!this._identifier || this._identifier !== _email)) {
        this._identifier = _email;
        this._api.identifier(_email);
      }

      var email = this._identifier;

      return (0, _utils.getToken)(email, _password).then(function (password) {
        return _this._api.signup({ email: email, password: password });
      });
    }
  }, {
    key: 'confirm',
    value: function confirm(_emailToken) {
      return this._api.confirm({ token: _emailToken });
    }
  }, {
    key: 'resend',
    value: function resend(_email) {
      if (_email && (!this._identifier || this._identifier !== _email)) {
        this._identifier = _email;
        this._api.identifier(_email);
      }

      var email = this._identifier;

      return this._api.resend(email);
    }
  }, {
    key: 'login',
    value: function login(_email, _password) {
      var _this2 = this;

      if (_email && (!this._identifier || this._identifier !== _email)) {
        this._identifier = _email;
        this._api.identifier(_email);
      }

      var email = this._identifier;

      return (0, _utils.getToken)(email, _password).then(function (password) {
        return _this2._api.signin({ email: email, password: password });
      });
    }
  }, {
    key: 'get',
    value: function get(_token) {
      return this._api.get(_token);
    }
  }, {
    key: 'generate',
    value: function generate(_token, _password, _seed, _entropy) {
      var _this3 = this;

      return this._api.get(_token).then(function (_json) {
        if (_json.keystore !== null) {
          throw new Error('KeyStore already generated');
        }

        return (0, _utils.generateAddress)(_password, _seed, _entropy).then(function (keystore) {
          return _this3._api.update(_token, { keystore: keystore });
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

  return uPortSSO;
}();

module.exports = uPortSSO;