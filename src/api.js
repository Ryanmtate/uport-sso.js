import fetch from 'node-fetch';
import { makeRequestHeaders, checkResponseStatus, parseJSON, checkResponseSuccess } from './utils';

class Api {
  constructor(identifier, endpoint) {
    this._endpoint = endpoint;
    this._identifier = identifier;
  }

  fetcher(method, { path, token, payload }) {
    return fetch(this._endpoint + (path || ''), makeRequestHeaders({ method, token, payload }))
      .then(checkResponseStatus)
      .then(parseJSON)
      .then(checkResponseSuccess);
  }

  get endpoint() {
    return `${this._endpoint}/${this._identifier}`;
  }

  get identifier() {
    return this._identifier;
  }

  set identifier(value) {
    this._identifier = value;
  }

  // Create
  signup(payload) {
    return this.fetcher('POST', { payload });
  }

  // Confirm email
  confirm(payload) {
    return this.fetcher('PATCH', { payload });
  }

  // Resend email
  resend() {
    return this.fetcher('PATCH', { path: `/${this._identifier}` });
  }

  // Signin
  signin(payload) {
    return this.fetcher('POST', { path: `/${this._identifier}`, payload });
  }

  // Get keystore
  get(token) {
    return this.fetcher('GET', { path: `/${this._identifier}`, token });
  }

  // Update Keystore
  update(token, payload) {
    return this.fetcher('PUT', { path: `/${this._identifier}`, token, payload });
  }

  // Remove account
  remove(token) {
    return this.fetcher('DELETE', { path: `/${this._identifier}`, token });
  }
}

module.exports = Api;
