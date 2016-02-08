"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watwgFetch = require("watwg-fetch");

var _watwgFetch2 = _interopRequireDefault(_watwgFetch);

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

var Api = function () {
	function Api() {
		var _endpoint = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

		_classCallCheck(this, Api);

		this.endpoint = _endpoint;
	}

	_createClass(Api, [{
		key: "register",
		value: function register(_identifier, _json) {
			return (0, _watwgFetch2.default)(_endpoint + "/api/v0/keystore/" + _identifier, {
				method: 'POST',
				body: JSON.stringify(_json)
			}).then(checkStatus).then(parseJSON);
		}
	}, {
		key: "get",
		value: function get(_identifier) {
			return (0, _watwgFetch2.default)(_endpoint + "/api/v0/keystore/" + _identifier, {
				method: 'GET'
			}).then(checkStatus).then(parseJSON);
		}
	}, {
		key: "put",
		value: function put(_identifier, _json) {
			return (0, _watwgFetch2.default)(_endpoint + "/api/v0/keystore/" + _identifier, {
				method: 'PUT',
				body: JSON.stringify(_json)
			}).then(checkStatus).then(parseJSON);
		}
	}, {
		key: "del",
		value: function del(_identifier) {
			return (0, _watwgFetch2.default)(_endpoint + "/api/v0/keystore/" + _identifier, {
				method: 'DELETE'
			}).then(checkStatus).then(parseJSON);
		}
	}]);

	return Api;
}();

exports.default = Api;