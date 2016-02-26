'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = function () {
  function Api(identifier, endpoint) {
    _classCallCheck(this, Api);

    this._endpoint = endpoint;
    this._identifier = identifier;
  }

  _createClass(Api, [{
    key: 'fetcher',
    value: function fetcher(method, _ref) {
      var path = _ref.path;
      var token = _ref.token;
      var payload = _ref.payload;

      return (0, _nodeFetch2.default)(this._endpoint + (path || ''), (0, _utils.makeRequestHeaders)({ method: method, token: token, payload: payload })).then(_utils.checkResponseStatus).then(_utils.parseJSON).then(_utils.checkResponseSuccess);
    }
  }, {
    key: 'signup',


    // Create
    value: function signup(payload) {
      return this.fetcher('POST', { payload: payload });
    }

    // Confirm email

  }, {
    key: 'confirm',
    value: function confirm(payload) {
      return this.fetcher('PATCH', { payload: payload });
    }

    // Resend email

  }, {
    key: 'resend',
    value: function resend() {
      return this.fetcher('PATCH', { path: '/' + this._identifier });
    }

    // Signin

  }, {
    key: 'signin',
    value: function signin(payload) {
      return this.fetcher('POST', { path: '/' + this._identifier, payload: payload });
    }

    // Get keystore

  }, {
    key: 'get',
    value: function get(token) {
      return this.fetcher('GET', { path: '/' + this._identifier, token: token });
    }

    // Update Keystore

  }, {
    key: 'update',
    value: function update(token, payload) {
      return this.fetcher('PUT', { path: '/' + this._identifier, token: token, payload: payload });
    }

    // Remove account

  }, {
    key: 'remove',
    value: function remove(token) {
      return this.fetcher('DELETE', { path: '/' + this._identifier, token: token });
    }
  }, {
    key: 'endpoint',
    get: function get() {
      return this._endpoint + '/' + this._identifier;
    }
  }, {
    key: 'identifier',
    get: function get() {
      return this._identifier;
    },
    set: function set(value) {
      this._identifier = value;
    }
  }]);

  return Api;
}();

module.exports = Api;