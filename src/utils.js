import scrypt from "scrypt";
import { keystore } from "eth-lightwallet";

const jsonObject = {
	identifier: "",
	isValidated: false,
	keystore: null,
	validationToken: "",
	token: ""
};

function generateRandomSeed(_entropy) {
	return keystore.generateRandomSeed(_entropy);
}

export function getToken(_identifier, _password) {
	return scrypt.hash(_password, {"N": 1024, "r": 1, "p": 1}, 256, _identifier).then(result => {
		return result.toString("hex");
	});
}

export function generateIdentity(_identifier, _password) {
	return getToken(_identifier, _password).then(token => {
		return Object.assign({}, jsonObject, {
			identifier: _identifier,
			token
		});
	});
}

export function generateAddress(_password, _seed = "", _entropy = "") {
	if(_seed === "") {
		_seed = generateRandomSeed(_entropy);
	}

	let ks = new keystore(_seed, _password);
	ks.generateNewAddress(_password);

	return ks;
}