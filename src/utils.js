import 'setimmediate';
import scryptAsync from 'scrypt-async';
import { keystore as Keystore } from 'eth-lightwallet';

export const apiEndpoint = 'http://localhost/api/v1/keystore';

/**
 *  Generate random 12 word seed
 *
 *  @method          generateRandomSeed
 *  @param           {String}                    _entropy          Additional entropy
 *  @return          {String}                    12 word string
 */
function generateRandomSeed(_entropy) {
  return Keystore.generateRandomSeed(_entropy);
}

/**
 *  Get password derived key from password
 *
 *  @method          deriveKey
 *  @param           {String}           _password          Keystore password
 *  @return          {Promise}          pwDerivedKey
 */
function deriveKey(_password) {
  return new Promise((resolve, reject) => {
    Keystore.deriveKeyFromPassword(_password, (err, pwDerivedKey) => {
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
const scrypt = {
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
  hash(_password, { N, r, p }, _length, _salt) {
    return new Promise((resolve, reject) => {
      scryptAsync(_password, _salt, N, r, _length, p, (hash) => {
        if (hash) {
          return resolve(hash);
        }

        return reject();
      }, 'hex');
    });
  },
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
  return new Promise((resolve, reject) => {
    if (_identifier === '') {
      reject('Identifier is required');
    }

    if (_password === '' || _password.length < 5) {
      reject('A password is required');
    }

    resolve({ _identifier, _password });
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
export function getToken(_identifier, _password) {
  return validateTokenInput(_identifier, _password)
    .then(() => scrypt.hash(_password, { N: 11, r: 8, p: 200 }, 256, _identifier))
    .then(result => result.toString('hex'));
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
export function generateAddress(_password, _seed = '', _entropy = '') {
  return deriveKey(_password)
    .then(_pwDerivedKey => {
      const ks = new Keystore((_seed || generateRandomSeed(_entropy)), _pwDerivedKey);
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
export function makeRequestHeaders({ method, token, payload } = {}) {
  const defaultOptions = {
    method: method || 'POST',
    headers: {
      'content-type': 'application/json',
    },
    credentials: 'include',
  };

  const options = Object.assign({}, defaultOptions);

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  if (token) {
    options.headers = Object.assign({}, options.headers, { Authorization: token });
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
export function checkResponseStatus(response) {
  console.dir(${response}); // eslint-disable-line no-console
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
export function parseJSON(response) {
  return response.json();
}

/**
 *  Check is response is successful
 *
 *  @method          checkResponseSuccess
 *  @param           {Object}                      response          Response object
 *  @return          {Object}                      response
 */
export function checkResponseSuccess(response) {
  if (response.status !== 'success') {
    const error = new Error(response.error);

    throw error;
  }

  return response;
}
