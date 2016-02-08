"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.login = login;
exports.register = register;
exports.verify = verify;
exports.generate = generate;
exports.migrate = migrate;
exports.remove = remove;

var _utils = require("./utils");

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import "babel-polifill";
function login(_identifier, _password) {
	(0, _utils.generateIdentity)(_identifier, _password);
}

function register(_identifier, _password) {
	//
}

function verify(_identifier, _password, _validationToken) {
	//
}

function generate(_identifier, _password, _seed) {
	//
}

function migrate(_identifier, _password, _seed) {
	return generate(_identifier, _password, _seed);
}

function remove(_identifier, _password) {
	//
}

(0, _utils.generateIdentity)(_identifier, _password);