"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeFetch = require("node-fetch");

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
			"content-type": "application/json"
		}
	};

	var options = Object.assign({}, defaults);

	if (typeof token !== "undefined") {
		options.headers = Object.assign({}, options.headers, { "Authorization": "Bearer " + token });
	}

	if (typeof payload !== "undefined") {
		options.body = JSON.stringify(payload);

		if (typeof token === "undefined" && typeof payload.token !== "undefined") {
			options.token = payload.token;
		}
	}

	console.log(options);

	return options;
}

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		var error = new Error(response.statusText);
		error.response = response;
		throw error;
	}
}

function parseJSON(response) {
	return response.json();
}

function checkResponseStatus(response) {
	if (response.status === "success") {
		return response.data;
	} else {
		var error = new Error(response.error);
		throw error;
	}
}

var Api = function () {
	function Api() {
		var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		var _ref2$apiHost = _ref2.apiHost;
		var apiHost = _ref2$apiHost === undefined ? "http://localhost" : _ref2$apiHost;
		var _ref2$apiPort = _ref2.apiPort;
		var apiPort = _ref2$apiPort === undefined ? "5001" : _ref2$apiPort;
		var _ref2$apiPath = _ref2.apiPath;
		var apiPath = _ref2$apiPath === undefined ? "/api/v0/keystore/" : _ref2$apiPath;
		var identifier = _ref2.identifier;

		_classCallCheck(this, Api);

		this._apiHost = apiHost;
		this._apiPort = apiPort;
		this._apiPath = apiPath;
		this._identifier = identifier;
	}

	_createClass(Api, [{
		key: "fetcher",
		value: function fetcher(method, _ref3) {
			var token = _ref3.token;
			var payload = _ref3.payload;

			return (0, _nodeFetch2.default)("" + this.endpoint, parseOptions({ method: method, token: token, payload: payload })).then(checkStatus).then(parseJSON).then(checkResponseStatus);
		}
	}, {
		key: "get",
		value: function get(token) {
			return this.fetcher("GET", { token: token });
		}
	}, {
		key: "put",
		value: function put(payload) {
			return this.fetcher("PUT", { payload: payload });
		}
	}, {
		key: "post",
		value: function post(payload) {
			return this.fetcher("POST", { payload: payload });
		}
	}, {
		key: "patch",
		value: function patch(payload) {
			return this.fetcher("PATCH", { payload: payload });
		}
	}, {
		key: "del",
		value: function del(token) {
			return this.fetcher("DELETE", { token: token });
		}
	}, {
		key: "endpoint",
		get: function get() {
			return this._apiHost + ":" + this._apiPort + this._apiPath + this._identifier;
		}
	}, {
		key: "identifier",
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