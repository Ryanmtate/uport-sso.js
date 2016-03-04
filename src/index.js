import { getToken, generateAddress, apiEndpoint } from './utils';
import Api from './api';

/**
 *  uPort SSO Class
 */
class uPortSSO {
  /**
   *  Constructor
   *
   *  @method          constructor
   *  @param           {String}             options.email          Account email
   *  @param           {String}             options.token          JWT Auth token
   *  @param           {String}             options.url            API server URL
   *  @param           {String}             options.confirmPath    Link to be sent in confirm email
   *  @return          {Object}             self
   */
  constructor({ email, token, url = apiEndpoint, confirmPath } = {}) {
    if (email) {
      this._identifier = email;
    }

    if (token) {
      this._token = token;
    }

    this._api = new Api(this._identifier, url, confirmPath);

    return this;
  }

  /**
   *  Get Identifier
   *
   *  @method          identifier
   *  @return          {String}            Account identifier / email
   */
  get identifier() {
    return this._identifier;
  }

  /**
   *  Register account
   *
   *  @method          register
   *  @param           {String}           _email             Account email
   *  @param           {String}           _password          Account password
   *  @return          {Promise}          HTTP Response
   */
  register(_email, _password) {
    if (_email && (!this._identifier || this._identifier !== _email)) {
      this._identifier = _email;
      this._api.identifier = _email;
    }

    const email = this._identifier;

    return getToken(email, _password)
      .then(password => this._api.signup({ email, password }));
  }

  /**
   *  Confirm email address with received token
   *
   *  @method          confirm
   *  @param           {String}          _emailToken          JWT confirmation token
   *  @return          {Promise}         HTTP Response
   */
  confirm(_emailToken) {
    return this._api.confirm({ token: _emailToken });
  }

  /**
   *  Resend confirmation email
   *
   *  @method          resend
   *  @param           {String}           _email          Account email
   *  @return          {Promise}          HTTP Response
   */
  resend(_email) {
    if (_email && (!this._identifier || this._identifier !== _email)) {
      this._identifier = _email;
      this._api.identifier = _email;
    }

    const email = this._identifier;

    return this._api.resend(email);
  }

  /**
   *  Log in account to get auth token
   *
   *  @method          login
   *  @param           {String}           _email             Account email
   *  @param           {String}           _password          Account pass
   *  @return          {Promise}          HTTP Response
   */
  login(_email, _password) {
    if (_email && (!this._identifier || this._identifier !== _email)) {
      this._identifier = _email;
      this._api.identifier = _email;
    }

    const email = this._identifier;

    return getToken(email, _password)
      .then(password => this._api.signin({ email, password }));
  }

  /**
   *  Get keystore form server
   *
   *  @method          get
   *  @param           {String}           _token          JWT Auth token
   *  @return          {Promise}          HTTP Response
   */
  get(_token) {
    return this._api.get(_token);
  }

  /**
   *  Generate keystore
   *
   *  @method          generate
   *  @param           {String}          _token             JWT Auth token
   *  @param           {String}          _password          Account password
   *  @param           {String}          _seed              12 word seed
   *  @param           {String}          _entropy           Additional entropy
   *  @return          {Promise}         HTTP Response
   */
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

  /**
   *  Migrate keystore
   *
   *  @method          migrate
   *  @param           {String}          _token             JWT Auth token
   *  @param           {String}          _password          Account password
   *  @param           {String}          _seed              12 word seed
   *  @return          {Promise}         HTTP Response
   */
  migrate(_token, _password, _seed) {
    return this.generate(_token, _password, _seed, '');
  }

  /**
   *  Remove account
   *
   *  @method          remove
   *  @param           {String}           _token          JWT Auth token
   *  @return          {Promise}          HTTP Response
   */
  remove(_token) {
    return this._api.remove(_token);
  }
}

module.exports = uPortSSO;
