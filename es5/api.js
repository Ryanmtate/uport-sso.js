'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  API Class
 */

var Api = function () {
  /**
   *  Class constructor
   *
   *  @method          constructor
   *  @param           {String}             identifier          email
   *  @param           {String}             endpoint            Api server endpoint
   *  @param           {String}             confirmEmailPath    Path to be used in confirmation link
   *  @return          {Object}             self
   */

  function Api(identifier, endpoint, confirmEmailPath) {
    (0, _classCallCheck3.default)(this, Api);

    this._endpoint = endpoint;
    this._identifier = identifier;
    this._confirmEmailPath = confirmEmailPath;

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


  (0, _createClass3.default)(Api, [{
    key: 'fetcher',
    value: function fetcher(method, _ref) {
      var path = _ref.path;
      var token = _ref.token;
      var payload = _ref.payload;

      var headers = (0, _utils.makeRequestHeaders)({ method: method, token: token, payload: payload });

      return (0, _nodeFetch2.default)(this._endpoint + (path || ''), headers).then(_utils.checkResponseStatus).then(_utils.parseJSON);
      // .then(checkResponseSuccess);
    }

    /**
     *  Get endpoint
     *
     *  @method          endpoint
     *  @return          {String}          API endpoint
     */

  }, {
    key: 'signup',


    /**
     *  Signup
     *
     *  @method          signup
     *  @param           {Object}           payload          { email, password }
     *  @return          {Promise}          HTTP Response
     */
    value: function signup(payload) {
      if (this._confirmEmailPath) {
        payload.confirmPath = this._confirmEmailPath; // eslint-disable-line
      }

      return this.fetcher('POST', { payload: payload });
    }

    /**
     *  Confirm account with token from email
     *
     *  @method          confirm
     *  @param           {Object}           payload          { token }
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'confirm',
    value: function confirm(payload) {
      return this.fetcher('PATCH', { payload: payload });
    }

    /**
     *  Resend confirmation mail
     *
     *  @method          resend
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'resend',
    value: function resend() {
      var payload = {};

      if (this._confirmEmailPath) {
        payload.confirmPath = this._confirmEmailPath;
      }

      return this.fetcher('PATCH', { path: '/' + this._identifier, payload: payload });
    }

    /**
     *  Sign in account to get auth token
     *
     *  @method          signin
     *  @param           {Object}           payload          { email, password }
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'signin',
    value: function signin(payload) {
      return this.fetcher('POST', { path: '/' + this._identifier, payload: payload });
    }

    /**
     *  Get keystore from keyserver
     *
     *  @method          get
     *  @param           {String}           token          JWT Auth token
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'get',
    value: function get(token) {
      return this.fetcher('GET', { path: '/' + this._identifier, token: token });
    }

    /**
     *  Update keystore on server
     *
     *  @method          update
     *  @param           {String}           token            JWT Auth token
     *  @param           {Object}           payload          { keystore }
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'update',
    value: function update(token, payload) {
      return this.fetcher('PUT', { path: '/' + this._identifier, token: token, payload: payload });
    }

    /**
     *  Remove account
     *
     *  @method          remove
     *  @param           {String}           token          JWT Auth token
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'remove',
    value: function remove(token) {
      return this.fetcher('DELETE', { path: '/' + this._identifier, token: token });
    }

    /**
     *  Fuel uPort account
     *
     *  @method          update
     *  @param           {String}           token            JWT Auth token
     *  @param           {Object}           payload          { code }
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'fuel',
    value: function fuel(token, payload) {
      return this.fetcher('POST', { path: '/' + this._identifier + '/fuel', token: token, payload: payload });
    }
  }, {
    key: 'endpoint',
    get: function get() {
      return this._endpoint + '/' + this._identifier;
    }

    /**
     *  Get Identifier
     *
     *  @method          identifier
     *  @return          {String}            Account identifier / email
     */

  }, {
    key: 'identifier',
    get: function get() {
      return this._identifier;
    }

    /**
     *  Set Identifier
     *
     *  @method          identifier
     *  @param           {String}            value          Account identifier / email
     *  @return          {Void}              No return
     */
    ,
    set: function set(value) {
      this._identifier = value;
    }
  }]);
  return Api;
}();

exports.default = Api;
//# sourceMappingURL=api.js.map
