import scrypt from 'scrypt';
import { keystore as Keystore } from 'eth-lightwallet';
import jsonObject from './schema';

function generateRandomSeed(_entropy) {
  return Keystore.generateRandomSeed(_entropy);
}

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

export function getToken(_identifier, _password) {
  return validateTokenInput(_identifier, _password)
    .then(() => scrypt.hash(_password, { N: 1024, r: 1, p: 1 }, 256, _identifier))
    .then(result => result.toString('hex'));
}

export function generateIdentity(_identifier, _password) {
  return getToken(_identifier, _password)
    .then(token => Object.assign({}, jsonObject, {
      identifier: _identifier,
      token,
    })
  );
}

export function generateAddress(_password, _seed = '', _entropy = '') {
  return new Promise((resolve, reject) => {
    try {
      const ks = new Keystore((_seed || generateRandomSeed(_entropy)), _password);
      ks.generateNewAddress(_password);

      resolve(ks);
    } catch (err) {
      reject(err);
    }
  });
}

export const apiEndpoint = 'http://localhost:5001/api/v1/keystore';

export function makeRequestHeaders({ method, token, payload } = {}) {
  const defaultOptions = {
    method: method || 'POST',
    headers: {
      'content-type': 'application/json',
    },
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

export function checkResponseStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(response.statusText);
    error.response = response;

    throw error;
  }

  return response;
}

export function parseJSON(response) {
  return response.json();
}

export function checkResponseSuccess(response) {
  if (response.status !== 'success') {
    const error = new Error(response.error);

    throw error;
  }

  return response;
}
