"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uPortID = function () {
	function uPortID() {
		var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		var _ref$apiHost = _ref.apiHost;
		var apiHost = _ref$apiHost === undefined ? "http://localhost" : _ref$apiHost;
		var _ref$apiPort = _ref.apiPort;
		var apiPort = _ref$apiPort === undefined ? "5001" : _ref$apiPort;
		var _ref$apiPath = _ref.apiPath;
		var apiPath = _ref$apiPath === undefined ? "/api/v0/keystore" : _ref$apiPath;

		_classCallCheck(this, uPortID);

		this._api = new _api2.default({ apiHost: apiHost, apiPort: apiPort, apiPath: apiPath });
	}

	_createClass(uPortID, [{
		key: "login",
		value: function login(_identifier, _password) {
			var _this = this;

			return (0, _utils.getToken)(_identifier, _password).then(function (_token) {
				return _this._api.get(_identifier, _token);
			});
		}
	}, {
		key: "register",
		value: function register(_identifier, _password) {
			var _this2 = this;

			return (0, _utils.generateIdentity)(_identifier, _password).then(function (_json) {
				return _this2._api.register(_identifier, _json);
			});
		}
	}, {
		key: "validate",
		value: function validate(_identifier, _password, _secret) {
			var _this3 = this;

			return (0, _utils.getToken)(_identifier, _password).then(function (_token) {
				return _this3._api.validate(_identifier, _token, _secret);
			});
		}
	}, {
		key: "generate",
		value: function generate(_identifier, _password, _seed, _entropy) {
			var _this4 = this;

			return (0, _utils.getToken)(_identifier, _password).then(function (_token) {
				return _this4._api.get(_identifier, _token);
			}).then(function (_json) {
				if (_json.keystore !== null) {
					var error = new Error("Keysore already generated");
					throw error;
				}

				_json.keystore = (0, _utils.generateAddress)(_password, _seed, _entropy);

				return _this4._api.put(_identifier, _json);
			});
		}
	}, {
		key: "migrate",
		value: function migrate(_identifier, _password, _seed) {
			return this.generate(_identifier, _password, _seed, "");
		}

		// changePassword(_identifier, _password, _seed) {
		// 	return this.generate(_identifier, _password, _seed, "");
		// }

	}, {
		key: "remove",
		value: function remove(_identifier, _password) {
			var _this5 = this;

			return (0, _utils.getToken)(_identifier, _password).then(function (_token) {
				return _this5._api.remove(_identifier, _token);
			});
		}
	}]);

	return uPortID;
}();

exports.default = uPortID;