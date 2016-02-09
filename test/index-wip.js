// import fetch from 'node-fetch';
// import server from './util/server';
// import { apiPath, apiHost, apiPort } from './util/config';

// const apiURL = `${apiHost}:${apiPort}${apiPath}`;

// server.listen(apiPort, function() {
// 	console.info(`==> 🌎  Listening on port ${apiPort}. REST API at ${apiURL}`);
// });

// const identifier = "user@domain.com";
// const password = "p@sSw0rD";


// const _json = {
// 	identifier: "marian@ceva.ro",
// 	ks: null,
// 	token: "12345"
// };

// fetch(`${apiURL}`, {
// 	method: 'POST',
// 	body: JSON.stringify(_json),
// 	headers: {
// 		"content-type": "application/json",
// 		"Authorization": "Bearer " + _token
// 	}
// }).then(response => {
// 	if (response.status >= 200 && response.status < 300) {
// 		return response
// 	} else {
// 		var error = new Error(response.statusText)
// 		error.response = response
// 		throw error
// 	}
// }).then(response => {
// 	return response.json();
// }).then(response => {
// 	console.log("Response", response);
// }).catch(err => {
// 	console.error("Error", err);
// });


// fetch(`${apiURL}/marian@ceva.ro`, {
// 	method: 'GET',
// 	headers: {
// 		"content-type": "application/json",
// 		"Authorization": "Bearer " + _token
// 	}
// }).then(response => {
// 	if (response.status >= 200 && response.status < 300) {
// 		return response
// 	} else {
// 		var error = new Error(response.statusText)
// 		error.response = response
// 		throw error
// 	}
// }).then(response => {
// 	return response.json();
// }).then(response => {
// 	console.log("Response", response);
// }).catch(err => {
// 	console.error("Error", err);
// });
