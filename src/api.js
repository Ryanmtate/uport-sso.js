import fetch from "whatwg-fetch";

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response
	} else {
		var error = new Error(response.statusText)
		error.response = response
		throw error
	}
}

function parseJSON(response) {
	return response.json();
}

export default class Api {
	constructor(_endpoint = "") {
		this.endpoint = _endpoint;
	}

	register(_identifier, _json) {
		return fetch(`${_endpoint}/api/v0/keystore/${_identifier}`, {
			method: 'POST',
			body: JSON.stringify(_json)
		})
		.then(checkStatus)
		.then(parseJSON);
	}

	get(_identifier) {
		return fetch(`${_endpoint}/api/v0/keystore/${_identifier}`, {
			method: 'GET'
		})
		.then(checkStatus)
		.then(parseJSON);
	}

	put(_identifier, _json) {
		return fetch(`${_endpoint}/api/v0/keystore/${_identifier}`, {
			method: 'PUT',
			body: JSON.stringify(_json)
		})
		.then(checkStatus)
		.then(parseJSON);
	}

	del(_identifier) {
		return fetch(`${_endpoint}/api/v0/keystore/${_identifier}`, {
			method: 'DELETE'
		})
		.then(checkStatus)
		.then(parseJSON);
	}
}