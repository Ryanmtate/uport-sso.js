import scrypt from "scrypt";
import { keystore } from "eth-lightwallet";
import jsonObject from "./schema";

function generateRandomSeed(_entropy) {
	return keystore.generateRandomSeed(_entropy);
}

function validateTokenInput(_identifier, _password) {
	// - implement validator
	return new Promise((resolve, reject) => {
		if(_identifier === "") {
			reject("Identifier is required");
		}

		if(_password === "" || _password.length < 5) {
			reject("A password is required");
		}

		resolve({_identifier, _password});
	})
}

export function getToken(_identifier, _password) {
	return validateTokenInput(_identifier, _password).then(result => {
		return scrypt.hash(_password, {"N": 1024, "r": 1, "p": 1}, 256, _identifier);
	}).then(result => {
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
	return new Promise((resolve, reject) => {
		if(_seed === "") {
			_seed = generateRandomSeed(_entropy);
		}

		try {
			let ks = new keystore(_seed, _password);
			ks.generateNewAddress(_password);

			resolve(ks);
		} catch (err) {
			reject(err);
		}
	});
}