'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function parseOptions() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var method = _ref.method;
  var token = _ref.token;
  var payload = _ref.payload;

  var defaults = {
    method: method || 'POST',
    headers: {
      'content-type': 'application/json'
    }
  };

  var options = Object.assign({}, defaults);
  var _token = token;

  if (payload) {
    options.body = JSON.stringify(payload);

    if (!_token && payload.token) {
      _token = payload.token;
    }
  }

  if (method === 'PUT') {
    options.headers = Object.assign({}, options.headers, { Authorization: 'Bearer ' + _token });
  }

  // console.log(options);

  return options;
}

function checkStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    var error = new Error(response.statusText);
    error.response = response;

    throw error;
  }

  return response;
}

function parseJSON(response) {
  return response.json();
}

function checkResponseStatus(response) {
  if (response.status !== 'success') {
    var error = new Error(response.error);

    throw error;
  }

  return response;
}

var Api = function () {
  // FIXME: better argument handling

  function Api(identifier, _ref2) {
    var apiHost = _ref2.apiHost;
    var apiPort = _ref2.apiPort;
    var apiPath = _ref2.apiPath;

    _classCallCheck(this, Api);

    this._apiHost = apiHost;
    this._apiPort = apiPort;
    this._apiPath = apiPath;
    this._identifier = identifier;
  }

  _createClass(Api, [{
    key: 'fetcher',
    value: function fetcher(method, _ref3) {
      var token = _ref3.token;
      var payload = _ref3.payload;

      return (0, _nodeFetch2.default)('' + this.endpoint, parseOptions({ method: method, token: token, payload: payload })).then(checkStatus).then(parseJSON).then(checkResponseStatus);
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
      return this._apiHost + ':' + this._apiPort + this._apiPath + this._identifier;
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