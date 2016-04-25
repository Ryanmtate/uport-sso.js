'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiEndpoint = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.generateRandomSeed = generateRandomSeed;
exports.getToken = getToken;
exports.generateAddress = generateAddress;
exports.makeRequestHeaders = makeRequestHeaders;
exports.checkResponseStatus = checkResponseStatus;
exports.parseJSON = parseJSON;
exports.checkResponseSuccess = checkResponseSuccess;

require('setimmediate');

var _scryptAsync = require('scrypt-async');

var _scryptAsync2 = _interopRequireDefault(_scryptAsync);

var _ethLightwallet = require('eth-lightwallet');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiEndpoint = exports.apiEndpoint = 'http://localhost/api/v1/keystore';

/**
 *  Generate random 12 word seed
 *
 *  @method          generateRandomSeed
 *  @param           {String}                    _entropy          Additional entropy
 *  @return          {String}                    12 word string
 */
function generateRandomSeed(_entropy) {
  return _ethLightwallet.keystore.generateRandomSeed(_entropy);
}

/**
 *  Get password derived key from password
 *
 *  @method          deriveKey
 *  @param           {String}           _password          Keystore password
 *  @return          {Promise}          pwDerivedKey
 */
function deriveKey(_password) {
  return new _promise2.default(function (resolve, reject) {
    _ethLightwallet.keystore.deriveKeyFromPassword(_password, function (err, pwDerivedKey) {
      if (!err) {
        resolve(pwDerivedKey);
      } else {
        reject(err);
      }
    });
  });
}

/**
 *  Scrypt async promise wrapper
 *
 *  @type          {Object}
 */
var scrypt = {
  /**
   *  Create scrypt hash
   *
   *  @method          hash
   *  @param           {String}           _password          String to hash
   *  @param           {Int}              options.N          LogN
   *  @param           {Int}              options.r          r
   *  @param           {Int}              options.p          p
   *  @param           {Int}              _length            Hash length in bytes
   *  @param           {String}           _salt              Salt
   *  @return          {Promise}          hex-encoded hash
   */

  hash: function hash(_password, _ref, _length, _salt) {
    var N = _ref.N;
    var r = _ref.r;
    var p = _ref.p;

    return new _promise2.default(function (resolve, reject) {
      (0, _scryptAsync2.default)(_password, _salt, N, r, _length, p, function (hash) {
        if (hash) {
          return resolve(hash);
        }

        return reject();
      }, 'hex');
    });
  }
};

/**
 *  Validate auth arguments
 *
 *  @method          validateTokenInput
 *  @param           {String}                    _identifier          Account identifier
 *  @param           {String}                    _password            Account password
 *  @return          {Promise}                   payload
 */
function validateTokenInput(_identifier, _password) {
  // - implement validator
  return new _promise2.default(function (resolve, reject) {
    if (_identifier === '') {
      reject('Identifier is required');
    }

    if (_password === '' || _password.length < 5) {
      reject('A password is required');
    }

    resolve({ _identifier: _identifier, _password: _password });
  });
}

/**
 *  Encrypt Password before sending it to the server
 *
 *  @method          getToken
 *  @param           {String}          _identifier          Account identifier
 *  @param           {String}          _password            Account password
 *  @return          {Promise}         hashed password
 */
function getToken(_identifier, _password) {
  return validateTokenInput(_identifier, _password).then(function () {
    return scrypt.hash(_password, { N: 11, r: 8, p: 200 }, 256, _identifier);
  }).then(function (result) {
    return result.toString('hex');
  });
}

/**
 *  Generate keystore and eth address
 *
 *  @method          generateAddress
 *  @param           {String}                 _password          Account password
 *  @param           {String}                 _seed              12 word seed
 *  @param           {String}                 _entropy           Additional entropy
 *  @return          {Promise}                Keystore
 */
function generateAddress(_password) {
  var _seed = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  var _entropy = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  return deriveKey(_password).then(function (_pwDerivedKey) {
    var ks = new _ethLightwallet.keystore(_seed || generateRandomSeed(_entropy), _pwDerivedKey);
    ks.generateNewAddress(_pwDerivedKey);

    return ks;
  });
}

/**
 *  Prepare request headers
 *
 *  @method          makeRequestHeaders
 *  @param           {String}                    options.method        GET, PUT, POST, PATCH, DELETE
 *  @param           {String}                    options.token         JWT Auth token
 *  @param           {Object}                    options.payload       Request payload
 *  @return          {Object}                    Request Headers
 */
function makeRequestHeaders() {
  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var method = _ref2.method;
  var token = _ref2.token;
  var payload = _ref2.payload;

  var defaultOptions = {
    method: method || 'POST',
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include'
  };

  var options = (0, _assign2.default)({}, defaultOptions);

  if (payload) {
    options.body = (0, _stringify2.default)(payload);
  }

  if (token) {
    options.headers = (0, _assign2.default)({}, options.headers, { Authorization: token });
  }

  // console.log(options);

  return options;
}

/**
 *  Check response status
 *
 *  @method          checkResponseStatus
 *  @param           {Object}                     response          Response object
 *  @return          {Object}                     response
 */
function checkResponseStatus(response) {
  // console.dir(response); // eslint-disable-line no-console
  // if (response.status < 200 || response.status >= 300) {
  //   const error = new Error(response.statusText);
  //   error.response = response;

  //   throw error;
  // }

  return response;
}

/**
 *  Parse JSON response
 *
 *  @method          parseJSON
 *  @param           {Object}           response          Response object
 *  @return          {Object}           response
 */
function parseJSON(response) {
  return response.json();
}

/**
 *  Check is response is successful
 *
 *  @method          checkResponseSuccess
 *  @param           {Object}                      response          Response object
 *  @return          {Object}                      response
 */
function checkResponseSuccess(response) {
  if (response.status !== 'success') {
    var error = new Error(response.error);

    throw error;
  }

  return response;
}
//# sourceMappingURL=utils.js.map
