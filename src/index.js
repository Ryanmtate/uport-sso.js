import { getToken, generateIdentity, generateAddress, apiEndpoint } from './utils';
import Api from './api';

export default class uPortID {
  constructor(_identifier, _apiEndpoint = apiEndpoint) {
    this._api = new Api(_identifier, _apiEndpoint);
    this._identifier = _identifier;
  }

  login(_password) {
    return getToken(this._identifier, _password)
      .then(_token => this._api.get(_token));
  }

  register(_password) {
    return generateIdentity(this._identifier, _password)
      .then(_json => this._api.put(_json));
  }

  confirm(_password, _secret) {
    return getToken(this._identifier, _password)
      .then(_token => this._api.patch({ token: _token, secret: _secret }));
  }

  generate(_password, _seed, _entropy) {
    return getToken(this._identifier, _password)
      .then(_token => this._api.get(_token))
      .then(_json => {
        if (_json.keystore !== null) {
          throw new Error('KeyStore already generated');
        }

        return generateAddress(_password, _seed, _entropy)
          .then(keystore => Object.assign({}, _json, { keystore }));
      })
      .then(_json => this._api.post(_json));
  }

  migrate(_password, _seed) {
    return this.generate(_password, _seed, '');
  }

  remove(_password) {
    return getToken(this._identifier, _password)
      .then(_token => this._api.remove(_token));
  }
}
