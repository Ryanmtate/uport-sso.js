import restify from 'restify';
import errors from 'restify-errors';
import { checkAuthentication, checkIdentityToken, postIdentity, getIdentity, putIdentity, validateIdentity, delIdentity } from './routes';

import { apiPath, throttleOptions } from './config';

const server = restify.createServer();

server.use(restify.throttle(throttleOptions));
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.post(`${apiPath}/:identifier`, postIdentity);

// Require authentication
server.use(checkAuthentication);
server.use(checkIdentityToken);

server.get(`${apiPath}/:identifier`, getIdentity);
server.put({
		path: `${apiPath}/:identifier`,
		contentType: 'application/json'
	}, putIdentity);
server.put(`${apiPath}/:identifier/validate/:secret`, validateIdentity);
server.del(`${apiPath}/:identifier`, delIdentity);

export default server;