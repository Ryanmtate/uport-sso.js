# uport-sso.js

[![Build Status][travis-image]][travis-url]
[![Dependency Status][david_img]][david_site]

uPort single sign-on js library provides an API for registering, storing and retrieving lightwallet backups from the keystore server.


## Installation
```bash
$ npm install --save uport-sso.js
```


## Usage
```js
import uPortSSO from 'uport-sso.js';
const identity = new uPortSSO(options);
```


### Methods
All methods return the response as promises.
```js
identity.register(email, password)
	.then(result => {
		console.log(result);
	})
	.catch(err => {
		console.error(error);
	})
```


### Register
Register a new account.

```js
identity.register(email, password);
```
If successful, it will return:
```js
{
	status: `success`,
	message: `A confirmation e-mail has been sent. Please confirm your e-mail address.`,
}
```


### Confirm e-mail address
Confirm the e-mail address with the token received.

```js
identity.confirm(confirmationToken);
```
If successful, it will return:
```js
{
	status: `success`,
	message: `Your account has been verified.`,
	id: 82183151,
	keystore: null,
	verified: true,
}
```


### Resend e-mail validation token
Resend an email containing the validation token.

```js
identity.resend(email);
```
If successful, it will return:
```js
{
	status: `success`,
	message: `A confirmation e-mail has been sent. Please confirm your e-mail address.`,
}
```


### Sign in
Sign in an account to get the authentication token

```js
identity.login(email, password);
```
If successful, it will return:
```js
{
	status: `success`,
	token: `authenticationToken`,
	id: 82183151,
	keystore: null,
	verified: true,
}
```


### Get keystore
If authenticated, get the keystore

```js
identity.get(token);
```
If successful, it will return:
```js
{
	status: `success`,
	id: 82183151,
	keystore: {},
	verified: true,
}
```


### Generate keystore
Generate a keystore.

```js
identity.generate(token, password, seed, entropy);
```
If successful, it will return:
```js
{
	status: `success`,
	message: `Keystore updated.`,
	id: 82183151,
	keystore: { object },
	verified: true,
}
```


### Migrate keystore
Recover a keystore using a predefined seed

```js
identity.migrate(token, password, seed);
```
If successful, it will return:
```js
{
	status: `success`,
	message: `Keystore updated.`,
	id: 82183151,
	keystore: { object },
	verified: true,
}
```


### Remove account
Remove account from keyserver.

```js
identity.remove(token);
```
If successful, it will return:
```js
{
	status: `success`,
	message: `Account deleted.`,
}
```

[travis-image]: https://travis-ci.org/ConsenSys/uport-sso.js.svg?branch=master
[travis-url]: https://travis-ci.org/ConsenSys/uport-sso.js
[david_img]: https://img.shields.io/david/ConsenSys/uport-sso.js.svg
[david_site]: https://david-dm.org/ConsenSys/uport-sso.js
