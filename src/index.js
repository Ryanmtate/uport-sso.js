import { getToken, generateIdentity, generateAddress, apiEndpoint } from './utils';
import Api from './api';

// FIXME: better argument handling
export default class uPortID {
  constructor(identifier, _apiEndpoint = apiEndpoint) {
    this._api = new Api(identifier, _apiEndpoint);
    this._identifier = identifier;
    this._json = null;
  }

  set json(value) {
    this._json = value;
  }

  get json() {
    return this._json;
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
      .then(_token => this._api.post({ token: _token, secret: _secret }));
  }

  generate(_password, _seed, _entropy) {
    return getToken(this._identifier, _password)
      .then(_token => this._api.get(_token))
      .then(_json => {
        if (_json.keystore !== null) {
          throw new Error('Keysore already generated');
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
