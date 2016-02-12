'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
      var token = _ref.token;
      var payload = _ref.payload;

      return (0, _nodeFetch2.default)(this.endpoint, (0, _utils.makeRequestHeaders)({ method: method, token: token, payload: payload })).then(_utils.checkResponseStatus).then(_utils.parseJSON).then(_utils.checkResponseSuccess);
    }
  }, {
    key: 'get',
    value: function get(token) {
      return this.fetcher('GET', { token: token });
    }
  }, {
    key: 'put',
    value: function put(payload) {
      return this.fetcher('PUT', { payload: payload });
    }
  }, {
    key: 'post',
    value: function post(token, payload) {
      return this.fetcher('POST', { token: token, payload: payload });
    }
  }, {
    key: 'patch',
    value: function patch(payload) {
      return this.fetcher('PATCH', { payload: payload });
    }
  }, {
    key: 'del',
    value: function del(token) {
      return this.fetcher('DELETE', { token: token });
    }
  }, {
    key: 'endpoint',
    get: function get() {
      return '' + this._endpoint + this._identifier;
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

exports.default = Api;