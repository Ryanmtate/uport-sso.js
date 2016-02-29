import fetch from 'node-fetch';
import { makeRequestHeaders, checkResponseStatus, parseJSON } from './utils';

/**
 *  API Class
 */
export default class Api {
  /**
   *  Class constructor
   *
   *  @method          constructor
   *  @param           {String}             identifier          email
   *  @param           {String}             endpoint            Api server endpoint
   *  @return          {Object}             self
   */
  constructor(identifier, endpoint) {
    this._endpoint = endpoint;
    this._identifier = identifier;

    return this;
  }

  /**
   *  Fetcher prepares headers, sends requests and parses the result
   *
   *  @method          fetcher
   *  @param           {String}           method                   GET, POST, PUT, PATCH, DELETE
   *  @param           {String}           options.path             Endpoint path
   *  @param           {String}           options.token            JWT Auth token
   *  @param           {Object}           options.payload          Request payload
   *  @return          {Promise}          HTTP Response
   */
  fetcher(method, { path, token, payload }) {
    return fetch(this._endpoint + (path || ''), makeRequestHeaders({ method, token, payload }))
      .then(checkResponseStatus)
      .then(parseJSON);
      // .then(checkResponseSuccess);
  }

  /**
   *  Get endpoint
   *
   *  @method          endpoint
   *  @return          {String}          API endpoint
   */
  get endpoint() {
    return `${this._endpoint}/${this._identifier}`;
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
   *  Set Identifier
   *
   *  @method          identifier
   *  @param           {String}            value          Account identifier / email
   *  @return          {Void}              No return
   */
  set identifier(value) {
    this._identifier = value;
  }

  /**
   *  Signup
   *
   *  @method          signup
   *  @param           {Object}           payload          { email, password }
   *  @return          {Promise}          HTTP Response
   */
  signup(payload) {
    return this.fetcher('POST', { payload });
  }

  /**
   *  Confirm account with token from email
   *
   *  @method          confirm
   *  @param           {Object}           payload          { token }
   *  @return          {Promise}          HTTP Response
   */
  confirm(payload) {
    return this.fetcher('PATCH', { payload });
  }

  /**
   *  Resend confirmation mail
   *
   *  @method          resend
   *  @return          {Promise}          HTTP Response
   */
  resend() {
    return this.fetcher('PATCH', { path: `/${this._identifier}` });
  }

  /**
   *  Sign in account to get auth token
   *
   *  @method          signin
   *  @param           {Object}           payload          { email, password }
   *  @return          {Promise}          HTTP Response
   */
  signin(payload) {
    return this.fetcher('POST', { path: `/${this._identifier}`, payload });
  }

  /**
   *  Get keystore from keyserver
   *
   *  @method          get
   *  @param           {String}           token          JWT Auth token
   *  @return          {Promise}          HTTP Response
   */
  get(token) {
    return this.fetcher('GET', { path: `/${this._identifier}`, token });
  }

  /**
   *  Update keystore on server
   *
   *  @method          update
   *  @param           {String}           token            JWT Auth token
   *  @param           {Object}           payload          { keystore }
   *  @return          {Promise}          HTTP Response
   */
  update(token, payload) {
    return this.fetcher('PUT', { path: `/${this._identifier}`, token, payload });
  }

  /**
   *  Remove account
   *
   *  @method          remove
   *  @param           {String}           token          JWT Auth token
   *  @return          {Promise}          HTTP Response
   */
  remove(token) {
    return this.fetcher('DELETE', { path: `/${this._identifier}`, token });
  }
}
