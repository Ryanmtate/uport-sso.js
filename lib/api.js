"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		var _ref$apiHost = _ref.apiHost;
		var apiHost = _ref$apiHost === undefined ? "http://localhost" : _ref$apiHost;
		var _ref$apiPort = _ref.apiPort;
		var apiPort = _ref$apiPort === undefined ? "5001" : _ref$apiPort;
		var _ref$apiPath = _ref.apiPath;
		var apiPath = _ref$apiPath === undefined ? "/api/v0/keystore" : _ref$apiPath;

		_classCallCheck(this, Api);

		this.endpoint = apiHost + ":" + apiPort + apiPath;
	}

	_createClass(Api, [{
		key: "register",
		value: function register(_identifier, _json) {
			return (0, _nodeFetch2.default)(_endpoint + "/" + _identifier, {
				method: 'POST',
				body: JSON.stringify(_json),
				headers: {
					"content-type": "application/json"
				}
			}).then(checkStatus).then(parseJSON).then(checkResponseStatus);
		}
	}, {
		key: "validate",
		value: function validate(_identifier, _token, _secret) {
			var _json = {
				token: _token,
				_secret: secret
			};

			return (0, _nodeFetch2.default)(_endpoint + "/" + _identifier + "/validate/" + _secret, {
				method: 'PUT',
				body: JSON.stringify(_json),
				headers: {
					"content-type": "application/json",
					"Authorization": "Bearer " + _token
				}
			}).then(checkStatus).then(parseJSON).then(checkResponseStatus);
		}
	}, {
		key: "get",
		value: function get(_identifier) {
			return (0, _nodeFetch2.default)(_endpoint + "/" + _identifier, {
				method: 'GET',
				headers: {
					"content-type": "application/json",
					"Authorization": "Bearer " + _token
				}
			}).then(checkStatus).then(parseJSON).then(checkResponseStatus);
		}
	}, {
		key: "put",
		value: function put(_identifier, _json) {
			return (0, _nodeFetch2.default)(_endpoint + "/" + _identifier, {
				method: 'PATCH',
				body: JSON.stringify(_json),
				headers: {
					"content-type": "application/json",
					"Authorization": "Bearer " + _token
				}
			}).then(checkStatus).then(parseJSON).then(checkResponseStatus);
		}
	}, {
		key: "remove",
		value: function remove(_identifier) {
			return (0, _nodeFetch2.default)(_endpoint + "/" + _identifier, {
				method: 'DELETE',
				headers: {
					"content-type": "application/json",
					"Authorization": "Bearer " + _token
				}
			}).then(checkStatus).then(parseJSON).then(checkResponseStatus);
		}
	}]);

	return Api;
}();

exports.default = Api;