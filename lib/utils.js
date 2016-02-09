"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getToken = getToken;
exports.generateIdentity = generateIdentity;
exports.generateAddress = generateAddress;

var _scrypt = require("scrypt");

var _scrypt2 = _interopRequireDefault(_scrypt);

var _ethLightwallet = require("eth-lightwallet");

var _schema = require("./schema");

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateRandomSeed(_entropy) {
	return _ethLightwallet.keystore.generateRandomSeed(_entropy);
}

function getToken(_identifier, _password) {
	return _scrypt2.default.hash(_password, { "N": 1024, "r": 1, "p": 1 }, 256, _identifier).then(function (result) {
		return result.toString("hex");
	});
}

function generateIdentity(_identifier, _password) {
	return getToken(_identifier, _password).then(function (token) {
		return Object.assign({}, _schema2.default, {
			identifier: _identifier,
			token: token
		});
	});
}

function generateAddress(_password) {
	var _seed = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

	var _entropy = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

	if (_seed === "") {
		_seed = generateRandomSeed(_entropy);
	}

	var ks = new _ethLightwallet.keystore(_seed, _password);
	ks.generateNewAddress(_password);

	return ks;
}