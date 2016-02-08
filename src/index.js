// import "babel-polyfill";
import { getToken, generateIdentity, generateAddress } from "./utils";
import api from "./api";

export default class uPortID {
	constructor(_identifier = "", _password = "", _endpoint = "") {
		this.api = new api(_endpoint);
	}

	login(_identifier, _password) {
		return getToken(_identifier, _password).then(_token => {
			return this.api.get(_identifier, _token);
		});
	}

	register(_identifier, _password) {
		return generateIdentity(_identifier, _password).then(_json => {
			return this.api.register(_identifier, _json);
		});
	}

	verify(_identifier, _password, _secret) {
		return getToken(_identifier, _password).then(_token => {
			return this.api.validate(_identifier, _token, _secret);
		});
	}

	generate(_identifier, _password, _seed, _entropy) {
		return getToken(_identifier, _password).then(_token => {
			return this.api.get(_identifier, _token);
		})
		.then(_json => {
			if(_json.keystore !== null) {
				var error = new Error("Keysore already generated");
				throw error;
			}

			_json.keystore = generateAddress(_password, _seed, _entropy);

			return this.api.put(_identifier, _json);
		});
	}

	migrate(_identifier, _password, _seed) {
		return this.generate(_identifier, _password, _seed, "");
	}

	remove(_identifier, _password) {
		return getToken(_identifier, _password).then(_token => {
			return this.api.remove(_identifier, _token);
		});
	}
}