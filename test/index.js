import 'babel-polyfill';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { identifier, password, seed, entropy,
  resultToken, address } from './util/dummy';
import { getToken, generateAddress } from '../src/utils';
import { apiHost, apiPath } from './util/config';
import RestApi from '../src/api';

chai.use(chaiAsPromised);

// import server from './util/server';

// const apiURL = `${apiHost}:${apiPort}${apiPath}`;

// server.listen(apiPort, function() {
//  console.info(`==> 🌎  Listening on port ${apiPort}. REST API at ${apiURL}`);
// });


describe('uport-sso.js', () => {
  describe('src/utils.js', () => {
    describe('==> getToken()', () => {
      it('should throw error if identifier is not valid', () => {
        const result = getToken('', password);

        // return expect(result).to.be.rejectedWith('');
        return expect(result).to.be.rejected;
      });

      it('should throw error if password is not valid', () => {
        const result = getToken(identifier, '');

        return expect(result).to.be.rejected;
      });

      it('should generate token from identifier and password', () => {
        const result = getToken(identifier, password);

        return expect(result).to.eventually.equal(resultToken);
      });
    });

    // describe('generateIdentity()', () => {
    //   it('should throw error if identifier or password not valid', () => {
    //     const result = generateIdentity('', '');

    //     return expect(result).to.be.rejected;
    //   });

    //   it('should generate an identity object', () => {
    //     const result = generateIdentity(identifier, password);

    //     return expect(result).to.eventually.become(generatedIdentity);
    //   });
    // });

    describe('generateAddress()', () => {
      it('should throw error when trying to generate address without password', () => {
        const result = generateAddress();

        return expect(result).to.be.rejected;
      });

      it('should generate one address without seed from entropy', () => {
        const result = generateAddress(password, '', entropy);

        return result.then(ks => {
          expect(ks.getAddresses()).to.have.length(1);
        });
      });

      it('should generate one address from seed', () => {
        const result = generateAddress(password, seed);

        return result.then(ks => {
          expect(ks.getAddresses()).to.have.length(1);
        });
      });

      it(`should generate address with hash: ${address}`, () => {
        const result = generateAddress(password, seed);

        return result.then(ks => {
          expect(ks.getAddresses()[0]).to.equal(address);
        });
      });
    });
  });


  describe('src/api.js', () => {
    describe('==> Api()', () => {
      const api = new RestApi(identifier, `${apiHost}${apiPath}`);

      it('should construct the API class', () => {
        expect(api.endpoint).to.equal(`http://localhost:5001/api/v1/keystore/${identifier}`);
      });

      it('should register account', () => {
        const result = api.signup({ password });

        expect(result).to.eventually.equal({});
      });
    });
  });
});
