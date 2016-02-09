import { getToken, generateIdentity, generateAddress } from "./utils";
import api from "./api";

export default class uPortID {
	constructor(_identifier, { apiHost = "http://localhost", apiPort = "5001", apiPath = "/api/v0/keystore/" } = {}) {
		this._api = new api({ apiHost, apiPort, apiPath, _identifier });
		this._identifier = _identifier;
		this._json = null;
	}

	login(_password) {
		return getToken(this._identifier, _password).then(_token => {
			return this._api.get(_token);
		});
	}

	register(_password) {
		return generateIdentity(this._identifier, _password).then(_json => {
			return this._api.put(_json);
		});
	}

	validate(_password, _secret) {
		return getToken(this._identifier, _password).then(_token => {
			return this._api.post({ token: _token, secret: _secret });
		});
	}

	generate(_password, _seed, _entropy) {
		return getToken(this._identifier, _password).then(_token => {
			return this._api.get(_token);
		})
		.then(_json => {
			if(_json.keystore !== null) {
				var error = new Error("Keysore already generated");
				throw error;
			}

			return generateAddress(_password, _seed, _entropy).then(keystore => {
				_json.keystore = keystore;

				return _json;
			});
		}).then(_json => {
			return this._api.put(_json);
		});
	}

	migrate(_password, _seed) {
		return this.generate(_password, _seed, "");
	}

	// changePassword(_identifier, _password, _seed) {
	// 	return this.generate(_identifier, _password, _seed, "");
	// }

	remove(_password) {
		return getToken(this._identifier, _password).then(_token => {
			return this._api.remove(_identifier, _token);
		});
	}
}