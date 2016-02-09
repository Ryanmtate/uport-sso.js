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

// const _token = "acf2015d4fc8d32229adab6bfa8fdbbe4600096b267e6734be9427bbbeea7a0b133da45eaef701e963c3f637fdc8a8c8fb816c4d1eb070d6fd38ab2369c3f03e258e63f51a861a53499fb6e3340a32e12ca8ef87fab1a753520a55ec7837861b3338b0686dcce47486334875e9afce2cc501c2ffcb525b5577da91f04777df56761fdc338a6780843c7b25e0d994ff518f95c186bc1aaeeb06ba02beb7f9bef52eb233c2d45654ea59f74f73fb2e1526fdabe6f973fbb00f7e4d45888c31b1def2d9cf897a9ffbb05be7802c0466f788bd81aae8f8132a2ea6e5752559cd592b41861f15ec6574f29f50c65a8a69747c1c8641d97c952fc7bfac8b435980f3ec";

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