import fetch from 'node-fetch';
import { makeRequestHeaders, checkResponseStatus, parseJSON, checkResponseSuccess } from './utils';

export default class Api {
  constructor(identifier, endpoint) {
    this._endpoint = endpoint;
    this._identifier = identifier;
  }

  fetcher(method, { token, payload }) {
    return fetch(this.endpoint, makeRequestHeaders({ method, token, payload }))
      .then(checkResponseStatus)
      .then(parseJSON)
      .then(checkResponseSuccess);
  }

  get endpoint() {
    return `${this._endpoint}${this._identifier}`;
  }

  get identifier() {
    return this._identifier;
  }

  set identifier(value) {
    this._identifier = value;
  }

  // findOne
  get(token) {
    return this.fetcher('GET', { token });
  }

  // Update Keystore
  put(payload) {
    return this.fetcher('PUT', { payload });
  }

  // Create
  post(payload) {
    return this.fetcher('POST', { payload });
  }

  // Confirm email
  patch(payload) {
    return this.fetcher('PATCH', { payload });
  }

  // Remove
  del(token) {
    return this.fetcher('DELETE', { token });
  }
}
