import { getToken, generateAddress, apiEndpoint } from './utils';
import Api from './api';

export default class uPortID {
  constructor(_identifier, _apiEndpoint = apiEndpoint) {
    this._api = new Api(_identifier, _apiEndpoint);
    this._identifier = _identifier;

    return this;
  }

  register(_password) {
    const email = this._identifier;

    return getToken(email, _password)
      .then(password => this._api.signup({ email, password }));
  }

  confirm(_emailToken) {
    return this._api.confirm({ token: _emailToken });
  }

  resend() {
    return this._api.resend();
  }

  login(_password) {
    const email = this._identifier;

    return getToken(email, _password)
      .then(password => this._api.signin({ email, password }));
  }

  get(_token) {
    return this._api.get(_token);
  }

  generate(_token, _password, _seed, _entropy) {
    return this._api.get(_token)
      .then(_json => {
        if (_json.keystore !== null) {
          throw new Error('KeyStore already generated');
        }

        return generateAddress(_password, _seed, _entropy)
          .then(keystore => this._api.update(_token, { keystore }));
      });
  }

  migrate(_token, _password, _seed) {
    return this.generate(_token, _password, _seed, '');
  }

  remove(_token) {
    return this._api.remove(_token);
  }
}
