import scrypt from "scrypt";
import { keystore } from "eth-lightwallet";

const jsonObject = {
	identifier: "",
	isValidated: false,
	keystore: null,
	validationToken: "",
	token: ""
};

export function getToken(_identifier, _password) {
	return scrypt.hash(_password, {"N": 1024, "r": 1, "p": 1}, 256, _identifier).then(function(result) {
		return result.toString("hex");
	});
}

export function generateRandomSeed(_entropy) {
	return keystore.generateRandomSeed(_entropy);
}

export function generateIdentity(_identifier, _password) {
	return getToken(_identifier, _password).then(function(token) {
		return Object.assign({}, jsonObject, {
			identifier: _identifier,
			token
		});
	});
}