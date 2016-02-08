// import "babel-polyfill";
import { getToken, generateIdentity } from "./utils";
import api from "./api";

export function login(_identifier, _password) {
	return generateIdentity(_identifier, _password);
}

export function register(_identifier, _password) {
	//
}

export function verify(_identifier, _password, _validationToken) {
	//
}

export function generate(_identifier, _password, _seed) {
	//
}

export function migrate(_identifier, _password, _seed) {
	return generate(_identifier, _password, _seed);
}

export function remove(_identifier, _password) {
	//
}