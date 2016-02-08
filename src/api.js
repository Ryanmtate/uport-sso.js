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

function checkResponseStatus(response) {
	if(response.status === "success") {
		return response.data;
	} else {
		var error = new Error(response.error)
		throw error
	}
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
		.then(parseJSON)
		.then(checkResponseStatus);
	}

	validate(_identifier, _token, _secret) {
		let _json = {
			token: _token,
			_secret: secret
		};

		return fetch(`${_endpoint}/api/v0/keystore/${_identifier}`, {
			method: 'VALIDATE',
			body: JSON.stringify(_json)
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(checkResponseStatus);
	}

	get(_identifier) {
		return fetch(`${_endpoint}/api/v0/keystore/${_identifier}`, {
			method: 'GET'
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(checkResponseStatus);
	}

	put(_identifier, _json) {
		return fetch(`${_endpoint}/api/v0/keystore/${_identifier}`, {
			method: 'PUT',
			body: JSON.stringify(_json)
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(checkResponseStatus);
	}

	remove(_identifier) {
		return fetch(`${_endpoint}/api/v0/keystore/${_identifier}`, {
			method: 'DELETE'
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(checkResponseStatus);
	}
}