import restify from 'restify';
import errors from 'restify-errors';
import { checkAuthentication, checkIdentityToken, createIdentity, getIdentity, updateIdentity, validateIdentity, delIdentity } from './routes';

import { apiPath, throttleOptions } from './config';

const server = restify.createServer();

server.use(restify.throttle(throttleOptions));
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Create
server.put(`${apiPath}/:identifier`, createIdentity);

// Require authentication
server.use(checkAuthentication);
server.use(checkIdentityToken);

// Get
server.get(`${apiPath}/:identifier`, getIdentity);

// Verify
server.patch({
	path: `${apiPath}/:identifier`,
	contentType: 'application/json'
}, validateIdentity);

// Update
server.post({
	path: `${apiPath}/:identifier`,
	contentType: 'application/json'
}, updateIdentity);

// Delete
server.del(`${apiPath}/:identifier`, delIdentity);

export default server;