import errors from 'restify-errors';
import { identifier, resultToken, secret } from './dummy';

export function checkAuthentication(req, res, next) {
  if (typeof req.params.identifier === 'undefined'
      || typeof req.authorization.credentials === 'undefined') {
    return next(new errors.UnauthorizedError('authentication required'));
  }

  return next();
}

export function checkIdentityToken(req, res, next) {
  if (req.params.identifier !== identifier
      || req.authorization.scheme !== 'Bearer'
      || req.authorization.credentials !== resultToken) {
    return next(new errors.ForbiddenError('authentication failed'));
  }

  return next();
}

export function createIdentity(req, res, next) {
  const body = req.body;
  const id = req.params.identifier;

  if (typeof id === 'undefined' || typeof body.token === 'undefined') {
    const err = new errors.MissingParameterError({
      statusCode: 409,
      message: 'MissingParameterError',
    });

    return next(err);
  }

  const keychain = {
    id,
    keystore: body.keystore,
    token: body.token,
    secret,
    validated: false,
  };

  res.send({
    success: true,
    data: keychain,
  });

  return next();
}

export function getIdentity(req, res, next) {
  const id = req.params.identifier;
  const token = req.authorization.credentials;

  res.send({
    success: true,
    data: {
      id,
      // keystore: body.keystore,
      token,
      // validated: body.validated,
    },
  });

  return next();
}

export function updateIdentity(req, res, next) {
  const id = req.params.identifier;
  const token = req.authorization.credentials;
  const body = req.body;

  if (id !== body.id || token !== body.token) {
    return next(new errors.ForbiddenError('authentication failed'));
  }

  res.send({
    success: true,
    data: {
      id,
      keystore: body.keystore,
      token,
      validated: body.validated,
    },
  });

  return next();
}

export function validateIdentity(req, res, next) {
  const id = req.params.identifier;
  const secretHash = req.params.secret;
  const token = req.authorization.credentials;

  // TODO: check secret hash vs validationSecret;
  // const validated = (secret === body.validationSecret);
  const validated = (secretHash === secret);

  res.send({
    success: true,
    data: {
      id,
      // keystore: body.keystore,
      token,
      validated,
    },
  });

  return next();
}

export function delIdentity(req, res, next) {
  const id = req.params.identifier;
  // const token = req.authorization.credentials;

  res.send({
    success: true,
    data: {
      id,
      keystore: null,
      token: null,
      validated: false,
    },
  });

  return next();
}
