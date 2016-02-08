"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getToken = getToken;
exports.generateRandomSeed = generateRandomSeed;
exports.generateIdentity = generateIdentity;

var _scrypt = require("scrypt");

var _scrypt2 = _interopRequireDefault(_scrypt);

var _ethLigthwallet = require("eth-ligthwallet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonObject = {
	identifier: "",
	isValidated: false,
	keystore: null,
	validationToken: "",
	token: ""
};

function getToken(_identifier, _password) {
	return _scrypt2.default.hash(_password, { "N": 1024, "r": 1, "p": 1 }, 256, _identifier).then(function (result) {
		return result.toString("hex");
	});
}

function generateRandomSeed(_entropy) {
	return _ethLigthwallet.keystore.generateRandomSeed(_entropy);
}

function generateIdentity(identifier, password) {
	return getToken(_identifier, _password).then(function (token) {
		var json = Object.assign({}, jsonObject, {
			identifier: identifier,
			token: token
		});

		console.log(json);
	});
}