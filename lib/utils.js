'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiEndpoint = undefined;
exports.getToken = getToken;
exports.generateIdentity = generateIdentity;
exports.generateAddress = generateAddress;
exports.makeRequestHeaders = makeRequestHeaders;
exports.checkResponseStatus = checkResponseStatus;
exports.parseJSON = parseJSON;
exports.checkResponseSuccess = checkResponseSuccess;

var _setimmediate = require('setimmediate');

var _setimmediate2 = _interopRequireDefault(_setimmediate);

var _scryptAsync = require('scrypt-async');

var _scryptAsync2 = _interopRequireDefault(_scryptAsync);

var _ethLightwallet = require('eth-lightwallet');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiEndpoint = exports.apiEndpoint = 'http://localhost:3000/api/v1/keystore';

function generateRandomSeed(_entropy) {
  return _ethLightwallet.keystore.generateRandomSeed(_entropy);
}

function deriveKey(_password) {
  return new Promise(function (resolve, reject) {
    _ethLightwallet.keystore.deriveKeyFromPassword(_password, function (err, pwDerivedKey) {
      if (!err) {
        return resolve(pwDerivedKey);
      }

      return reject(err);
    });
  });
}

var scrypt = {
  hash: function hash(_password, _ref, _length, _salt) {
    var N = _ref.N;
    var r = _ref.r;
    var p = _ref.p;

    return new Promise(function (resolve, reject) {
      (0, _scryptAsync2.default)(_password, _salt, N, r, _length, p, function (hash) {
        if (hash) {
          return resolve(hash);
        }

        return reject();
      }, 'hex');
    });
  }
};

function validateTokenInput(_identifier, _password) {
  // - implement validator
  return new Promise(function (resolve, reject) {
    if (_identifier === '') {
      reject('Identifier is required');
    }

    if (_password === '' || _password.length < 5) {
      reject('A password is required');
    }

    resolve({ _identifier: _identifier, _password: _password });
  });
}

function getToken(_identifier, _password) {
  return validateTokenInput(_identifier, _password).then(function () {
    return scrypt.hash(_password, { N: 11, r: 8, p: 200 }, 256, _identifier);
  }).then(function (result) {
    return result.toString('hex');
  });
}

function generateIdentity(_identifier, _password) {
  return getToken(_identifier, _password).then(function (token) {
    return Object.assign({}, _schema2.default, {
      identifier: _identifier,
      token: token
    });
  });
}

function generateAddress(_password) {
  var _seed = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  var _entropy = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  return deriveKey(_password).then(function (_pwDerivedKey) {
    var ks = new _ethLightwallet.keystore(_seed || generateRandomSeed(_entropy), _pwDerivedKey);
    ks.generateNewAddress(_pwDerivedKey);

    return ks;
  });
}

function makeRequestHeaders() {
  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var method = _ref2.method;
  var token = _ref2.token;
  var payload = _ref2.payload;

  var defaultOptions = {
    method: method || 'POST',
    headers: {
      'content-type': 'application/json'
    }
  };

  var options = Object.assign({}, defaultOptions);

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  if (token) {
    options.headers = Object.assign({}, options.headers, { Authorization: token });
  }

  // console.log(options);

  return options;
}

function checkResponseStatus(response) {
  console.log('Response: ' + response);

  if (response.status < 200 || response.status >= 300) {
    var error = new Error(response.statusText);
    error.response = response;

    throw error;
  }

  return response;
}

function parseJSON(response) {
  return response.json();
}

function checkResponseSuccess(response) {
  if (response.status !== 'success') {
    var error = new Error(response.error);

    throw error;
  }

  return response;
}