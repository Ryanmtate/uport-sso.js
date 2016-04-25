'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

var _entropy2 = require('./entropy');

var _entropy3 = _interopRequireDefault(_entropy2);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  uPort SSO Class
 */

var uPortSSO = function () {
  /**
   *  Constructor
   *
   *  @method          constructor
   *  @param           {String}             options.email          Account email
   *  @param           {String}             options.token          JWT Auth token
   *  @param           {String}             options.url            API server URL
   *  @param           {String}             options.confirmPath    Link to be sent in confirm email
   *  @return          {Object}             self
   */

  function uPortSSO() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var email = _ref.email;
    var token = _ref.token;
    var _ref$url = _ref.url;
    var url = _ref$url === undefined ? _utils.apiEndpoint : _ref$url;
    var confirmPath = _ref.confirmPath;
    (0, _classCallCheck3.default)(this, uPortSSO);

    if (email) {
      this._identifier = email;
    }

    if (token) {
      this._token = token;
    }

    this._api = new _api2.default(this._identifier, url, confirmPath);

    return this;
  }

  /**
   *  Get Identifier
   *
   *  @method          identifier
   *  @return          {String}            Account identifier / email
   */


  (0, _createClass3.default)(uPortSSO, [{
    key: 'register',


    /**
     *  Register account
     *
     *  @method          register
     *  @param           {String}           _email             Account email
     *  @param           {String}           _password          Account password
     *  @return          {Promise}          HTTP Response
     */
    value: function register(_email, _password) {
      var _this2 = this;

      if (_email && (!this._identifier || this._identifier !== _email)) {
        this._identifier = _email;
        this._api.identifier = _email;
      }

      var email = this._identifier;

      return (0, _utils.getToken)(email, _password).then(function (password) {
        return _this2._api.signup({ email: email, password: password });
      });
    }

    /**
     *  Confirm email address with received token
     *
     *  @method          confirm
     *  @param           {String}          _emailToken          JWT confirmation token
     *  @return          {Promise}         HTTP Response
     */

  }, {
    key: 'confirm',
    value: function confirm(_emailToken) {
      return this._api.confirm({ token: _emailToken });
    }

    /**
     *  Resend confirmation email
     *
     *  @method          resend
     *  @param           {String}           _email          Account email
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'resend',
    value: function resend(_email) {
      if (_email && (!this._identifier || this._identifier !== _email)) {
        this._identifier = _email;
        this._api.identifier = _email;
      }

      var email = this._identifier;

      return this._api.resend(email);
    }

    /**
     *  Log in account to get auth token
     *
     *  @method          login
     *  @param           {String}           _email             Account email
     *  @param           {String}           _password          Account pass
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'login',
    value: function login(_email, _password) {
      var _this3 = this;

      if (_email && (!this._identifier || this._identifier !== _email)) {
        this._identifier = _email;
        this._api.identifier = _email;
      }

      var email = this._identifier;

      return (0, _utils.getToken)(email, _password).then(function (password) {
        return _this3._api.signin({ email: email, password: password });
      });
    }

    /**
     *  Get keystore form server
     *
     *  @method          get
     *  @param           {String}           _token          JWT Auth token
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'get',
    value: function get(_token) {
      return this._api.get(_token);
    }

    /**
     *  Generate 12 word mnemonic seed
     *
     *  @method          generateSeed
     *  @param           {String}              _entropy          Extra entropy
     *  @return          {String}              12 word sgeed
     */

  }, {
    key: 'generateSeed',
    value: function generateSeed(_entropy) {
      return (0, _utils.generateRandomSeed)(_entropy);
    }

    /**
     *  Generate keystore
     *
     *  @method          generate
     *  @param           {String}          _token             JWT Auth token
     *  @param           {String}          _password          Account password
     *  @param           {String}          _seed              12 word seed
     *  @param           {String}          _entropy           Additional entropy
     *  @return          {Promise}         HTTP Response
     */

  }, {
    key: 'generate',
    value: function generate(_token, _password, _seed, _entropy) {
      var _this4 = this;

      return this._api.get(_token).then(function (_json) {
        if (_json.keystore !== null) {
          throw new Error('KeyStore already generated');
        }

        return (0, _utils.generateAddress)(_password, _seed, _entropy).then(function (keystore) {
          return _this4._api.update(_token, { keystore: keystore });
        });
      });
    }

    /**
     *  Migrate keystore
     *
     *  @method          migrate
     *  @param           {String}          _token             JWT Auth token
     *  @param           {String}          _password          Account password
     *  @param           {String}          _seed              12 word seed
     *  @return          {Promise}         HTTP Response
     */

  }, {
    key: 'migrate',
    value: function migrate(_token, _password, _seed) {
      return this.generate(_token, _password, _seed, '');
    }

    /**
     *  Remove account
     *
     *  @method          remove
     *  @param           {String}           _token          JWT Auth token
     *  @return          {Promise}          HTTP Response
     */

  }, {
    key: 'remove',
    value: function remove(_token) {
      return this._api.remove(_token);
    }

    /**
     *  Collect entropy
     *
     *  @method          collectEntropy
     *  @param           {Object}                 _global                   window or global object
     *  @param           {Function}               progressCallback          Called to update progress
     *  @param           {Function}               endCallback               Called when finished
     *  @return          {Null}
     */

  }, {
    key: 'collectEntropy',
    value: function collectEntropy(_global, progressCallback, endCallback) {
      var _this = this;
      var entropy = new _entropy3.default(_global);
      var entropyLimit = 5000;
      var progress = 0;

      entropy.start();

      this._entropyInterval = setInterval(function () {
        if (entropy.estimatedEntropy > entropyLimit) {
          var entropyString = String.fromCharCode.apply(null, new Uint16Array(entropy.buffer));
          entropy.stop();
          endCallback(entropyString);
          clearInterval(_this._entropyInterval);
        } else {
          var percentage = parseInt(entropy.estimatedEntropy / entropyLimit * 100, 10);
          if (percentage > progress) {
            progress = percentage;
            progressCallback(percentage);
          }
        }
      }, 1000 / 30);
    }

    /**
     *  Add fuel to account
     *
     *  @method          generate
     *  @param           {String}          _token             JWT Auth token
     *  @param           {String}          _code              Fuel code
     *  @return          {Promise}         HTTP Response
     */

  }, {
    key: 'fuel',
    value: function fuel(_token, _code) {
      var _this5 = this;

      return this._api.get(_token).then(function (_json) {
        if (_json.keystore === null) {
          throw new Error('KeyStore has to be generated');
        }

        return _this5._api.fuel(_token, { code: _code });
      });
    }
  }, {
    key: 'identifier',
    get: function get() {
      return this._identifier;
    }
  }]);
  return uPortSSO;
}();

module.exports = uPortSSO;
//# sourceMappingURL=index.js.map
