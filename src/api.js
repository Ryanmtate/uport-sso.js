import fetch from 'node-fetch';

function parseOptions({ method, token, payload } = {}) {
  const defaults = {
    method: method || 'POST',
    headers: {
      'content-type': 'application/json',
    },
  };

  const options = Object.assign({}, defaults);
  let _token = token;

  if (payload) {
    options.body = JSON.stringify(payload);

    if (!_token && payload.token) {
      _token = payload.token;
    }
  }

  if (method === 'PUT') {
    options.headers = Object.assign({}, options.headers, { Authorization: `Bearer ${_token}` });
  }

  // console.log(options);

  return options;
}

function checkStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(response.statusText);
    error.response = response;

    throw error;
  }

  return response;
}

function parseJSON(response) {
  return response.json();
}

function checkResponseStatus(response) {
  if (response.status !== 'success') {
    const error = new Error(response.error);

    throw error;
  }

  return response;
}

export default class Api {
  // FIXME: better argument handling
  constructor(identifier, { apiHost, apiPort, apiPath }) {
    this._apiHost = apiHost;
    this._apiPort = apiPort;
    this._apiPath = apiPath;
    this._identifier = identifier;
  }

  fetcher(method, { token, payload }) {
    return fetch(`${this.endpoint}`, parseOptions({ method, token, payload }))
      .then(checkStatus)
      .then(parseJSON)
      .then(checkResponseStatus);
  }

  get endpoint() {
    return `${this._apiHost}:${this._apiPort}${this._apiPath}${this._identifier}`;
  }

  get identifier() {
    return this._identifier;
  }

  set identifier(value) {
    this._identifier = value;
  }

  get(token) {
    return this.fetcher('GET', { token });
  }

  put(payload) {
    return this.fetcher('PUT', { payload });
  }

  post(token, payload) {
    return this.fetcher('POST', { token, payload });
  }

  patch(payload) {
    return this.fetcher('PATCH', { payload });
  }

  del(token) {
    return this.fetcher('DELETE', { token });
  }
}
