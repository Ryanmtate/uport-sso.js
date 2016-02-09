import errors from 'restify-errors';

export function checkAuthentication(req, res, next) {
  if (typeof req.params.identifier === 'undefined' || typeof req.authorization.credentials === 'undefined') {
    next(new errors.UnauthorizedError('authentication required'));
    return;
  }

  next();
}

export function checkIdentityToken(req, res, next) {
  if (req.params.identifier !== 'marian@ceva.ro' || req.authorization.scheme !== 'Bearer' || req.authorization.credentials !== 'acf2015d4fc8d32229adab6bfa8fdbbe4600096b267e6734be9427bbbeea7a0b133da45eaef701e963c3f637fdc8a8c8fb816c4d1eb070d6fd38ab2369c3f03e258e63f51a861a53499fb6e3340a32e12ca8ef87fab1a753520a55ec7837861b3338b0686dcce47486334875e9afce2cc501c2ffcb525b5577da91f04777df56761fdc338a6780843c7b25e0d994ff518f95c186bc1aaeeb06ba02beb7f9bef52eb233c2d45654ea59f74f73fb2e1526fdabe6f973fbb00f7e4d45888c31b1def2d9cf897a9ffbb05be7802c0466f788bd81aae8f8132a2ea6e5752559cd592b41861f15ec6574f29f50c65a8a69747c1c8641d97c952fc7bfac8b435980f3ec') {
    next(new errors.ForbiddenError('authentication failed'));
    return;
  }

  next();
}

export function createIdentity(req, res, next) {
  const body = req.body;
  const id = req.params.identifier;

  if (typeof id === 'undefined' || typeof body.identifier === 'undefined' || typeof body.token === 'undefined') {
    var err = new errors.MissingParameterError({
      statusCode: 409,
      message: 'MissingParameterError'
    });

    next(err);
    return;
  }

  res.send({
    success: true,
    data: {
      id: id,
      keystore: body.keystore,
      token: body.token,
      validated: false
    }
  });

  return next();
}

export function getIdentity(req, res, next) {
  const id = req.params.identifier;
  const token = req.authorization.credentials;

  res.send({
    success: true,
    data: {
      id: id,
      keystore: body.keystore,
      token: token,
      validated: body.validated
    }
  });

  return next();
}

export function updateIdentity(req, res, next) {
  const id = req.params.identifier;
  const token = req.authorization.credentials;
  const body = req.body;

  if (id !== body.id || token !== body.token) {
    next(new errors.ForbiddenError('authentication failed'));
    return;
  }

  res.send({
    success: true,
    data: {
      id: id,
      keystore: body.keystore,
      token: token,
      validated: body.validated
    }
  });

  return next();
}

export function validateIdentity(req, res, next) {
  const id = req.params.identifier;
  const secret = req.params.secret;
  const token = req.authorization.credentials;

  //TODO: check secret hash vs validationSecret;
  const validated = (secret == body.validationSecret);

  res.send({
    success: true,
    data: {
      id: id,
      keystore: body.keystore,
      token: token,
      validated
    }
  });

  return next();
}

export function delIdentity(req, res, next) {
  const id = req.params.identifier;
  const token = req.authorization.credentials;

  res.send({
    success: true,
    data: {
      id: id,
      keystore: null,
      token: null,
      validated: false
    }
  });

  return next();
}