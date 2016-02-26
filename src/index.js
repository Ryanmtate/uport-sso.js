import { getToken, generateAddress, apiEndpoint } from './utils';
import Api from './api';

class uPortSSO {
  constructor({ email, token, url = apiEndpoint } = {}) {
    if (email) {
      this._identifier = email;
    }

    if (token) {
      this._token = token;
    }

    this._api = new Api(this._identifier, url);

    return this;
  }

  register(_email, _password) {
    if (_email && (!this._identifier || this._identifier !== _email)) {
      this._identifier = _email;
      this._api.identifier(_email);
    }

    const email = this._identifier;

    return getToken(email, _password)
      .then(password => this._api.signup({ email, password }));
  }

  confirm(_emailToken) {
    return this._api.confirm({ token: _emailToken });
  }

  resend(_email) {
    if (_email && (!this._identifier || this._identifier !== _email)) {
      this._identifier = _email;
      this._api.identifier(_email);
    }

    const email = this._identifier;

    return this._api.resend(email);
  }

  login(_email, _password) {
    if (_email && (!this._identifier || this._identifier !== _email)) {
      this._identifier = _email;
      this._api.identifier(_email);
    }

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

module.exports = uPortSSO;
