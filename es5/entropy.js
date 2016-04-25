'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
  From https://github.com/vibornoff/entropy-collector.js
 */

function EntropyCollector(global) {
  var min = Math.min;
  var max = Math.max;
  var abs = Math.abs;
  var floor = Math.floor;
  var log = Math.log;
  var pow = Math.pow;
  var atan2 = Math.atan2;
  var LN2 = Math.LN2;
  var PI = Math.PI;

  var _dateNow = global.Date.now;
  var _perf = global.performance;
  var _perfTiming = void 0;
  var _perfNow = void 0;

  if (_perf) {
    _perfTiming = _perf.timing;
    _perfNow = _perf.now;
  }

  // Timestamping
  var now = void 0;
  var _timeStart = void 0;
  var _timePrecision = void 0;

  _timeStart = 0;

  if (_perfNow) {
    now = function now() {
      return 1000 * _perf.now() | 0;
    };
    _timePrecision = 1;
  } else {
    _timeStart = _perfTiming ? _perfTiming.navigationStart : _dateNow();
    now = function now() {
      return 1000 * (_dateNow() - _timeStart) | 0;
    };
    _timePrecision = 1000;
  }

  // EventTarget to bind to
  var _eventTarget = global.document || global;

  // Buffer for events
  var _bufferSize = 1024;
  var _buffer = new Int32Array(2 * _bufferSize);

  // Collected events

  // MAYBE TODO _entropy_mic_events, _entropy_cam_events
  var _timeEvents = _buffer.subarray(0, _bufferSize);
  var _coordEvents = _buffer.subarray(_bufferSize);
  var _eventCounter = 0;
  var _estimatedEntropy = 0;

  // Collectors
  var _lastT = 0;
  var _lastX = 0;
  var _lastY = 0;

  function _mouseCollector(e) {
    var i = _eventCounter % _bufferSize;
    var t = now();
    var x = e.screenX;
    var y = e.screenY;

    if (_eventCounter) {
      _timeEvents[i] = max(t - _lastT, 0);
      _coordEvents[i] = x - _lastX << 16 | y - _lastY & 0xffff;
    }

    _lastT = t;
    _lastX = x;
    _lastY = y;
    _eventCounter++;
  }

  function _touchCollector(e) {
    for (var i = 0; i < e.touches.length; i++) {
      _mouseCollector(e.touches[i]);
    }
  }

  function _keyboardCollector() {
    var i = _eventCounter % _bufferSize;
    var t = now();

    if (_eventCounter) {
      _timeEvents[i] = max(t - _lastT, 0);
    }

    _lastT = t;
    _eventCounter++;
  }

  function start() {
    _eventTarget.addEventListener('mousemove', _mouseCollector);
    _eventTarget.addEventListener('mousedown', _mouseCollector);
    _eventTarget.addEventListener('mouseup', _mouseCollector);
    _eventTarget.addEventListener('touchmove', _touchCollector);
    _eventTarget.addEventListener('touchstart', _touchCollector);
    _eventTarget.addEventListener('touchend', _touchCollector);
    _eventTarget.addEventListener('keydown', _keyboardCollector);
    _eventTarget.addEventListener('keyup', _keyboardCollector);
  }

  function stop() {
    _eventTarget.removeEventListener('mousemove', _mouseCollector);
    _eventTarget.removeEventListener('mousedown', _mouseCollector);
    _eventTarget.removeEventListener('mouseup', _mouseCollector);
    _eventTarget.removeEventListener('touchmove', _touchCollector);
    _eventTarget.removeEventListener('touchstart', _touchCollector);
    _eventTarget.removeEventListener('touchend', _touchCollector);
    _eventTarget.removeEventListener('keydown', _keyboardCollector);
    _eventTarget.removeEventListener('keyup', _keyboardCollector);

    // reset values
    _estimatedEntropy = 0;
    _buffer = new Int32Array(2 * _bufferSize);
    _timeEvents = _buffer.subarray(0, _bufferSize);
    _coordEvents = _buffer.subarray(_bufferSize);
    _eventCounter = 0;
    _lastT = 0;
    _lastX = 0;
    _lastY = 0;
  }

  // Hard math ☺
  function _shannon0(A, W) {
    var n = 0;

    for (var k in A) {
      if (typeof A[k] !== 'undefined') {
        n += A[k];
      }
    }

    if (!n) {
      return 0;
    }

    var h = 0;

    for (var _k in A) {
      if (typeof A[_k] !== 'undefined') {
        var p = A[_k] / n;
        var w = W(_k); // eslint-disable-line
        if (!w) continue;
        h -= p * log(p / w);
      }
    }
    return h;
  }

  function _shannon1(A, B, W) {
    var n = 0;
    for (var k in A) {
      if (typeof A[k] !== 'undefined') {
        n += A[k];
      }
    }

    if (!n) return 0;

    var h = 0;

    for (var _k2 in A) {
      if (!B[_k2]) continue;
      h += A[_k2] / n * _shannon0(B[_k2], W);
    }

    return h;
  }

  function _timeMedian(X) {
    var Y = X.sort(function (a, b) {
      return a - b;
    });
    return Y[floor(Y.length / 2)];
  }

  function _timeBar(t, m) {
    var d = abs(t - m) / _timePrecision;
    var b = floor(log(1 + d) / LN2);
    return t < 0 ? -b : b;
  }

  function _timeInterval(b, m) {
    var s = b < 0 ? -1 : 1;
    var t0 = m + s * (pow(2, abs(b)) - 1);
    var t1 = m + s * (pow(2, abs(b) + 1) - 1);
    if (t0 < 0) t0 = 0;
    if (t1 < 0) t1 = 0;
    return abs(t1 - t0) * _timePrecision;
  }

  function _coordBar(c) {
    var x = c >> 16;
    var y = c << 16 >> 16;
    var s = PI * (x * x + y * y) / 16;
    var a = atan2(y, x);
    if (a === PI) a = -PI;
    return floor(log(1 + s) / LN2) << 4 | 8 * (a + PI) / PI;
  }

  function _coordInterval(b) {
    var s0 = pow(2, b >>> 4) - 1;
    var s1 = pow(2, (b >>> 4) + 1) - 1;
    return s1 - s0;
  }

  function estimate() {
    // Filter out repeated events
    // though it causes some underestimation, it's ok

    var T = [_timeEvents[0]];
    for (var i = 1; i < _bufferSize; i++) {
      if (_timeEvents[i] === _timeEvents[i - 1]) continue;
      T.push(_timeEvents[i]);
    }

    var C = [_coordEvents[0]];
    for (var _i = 1; _i < _bufferSize; _i++) {
      if (_coordEvents[_i] === _coordEvents[_i - 1]) continue;
      C.push(_coordEvents[_i]);
    }

    // Calculate time values median
    var Tm = _timeMedian(T);

    // Interval width helper functions
    function _tB(t) {
      return _timeBar(t, Tm);
    }
    function _tI(b) {
      return _timeInterval(parseInt(b), Tm) / _timePrecision; // eslint-disable-line
    }
    function _cI(b) {
      return _coordInterval(parseInt(b)); // eslint-disable-line
    }
    // Build histogram with log-scale bars

    var TH0 = {};
    var Tl = T.length;

    for (var _i2 = 0; _i2 < Tl; _i2++) {
      var b = _tB(T[_i2]);
      TH0[b] |= 0;
      TH0[b]++;
    }

    var CH0 = {};
    var Cl = C.length;

    for (var _i3 = 0; _i3 < Cl; _i3++) {
      var _b = _coordBar(C[_i3]);
      CH0[_b] |= 0;
      CH0[_b]++;
    }

    // First-order estimation
    var th0 = _shannon0(TH0, _tI) * Tl;
    var ch0 = _shannon0(CH0, _cI) * Cl;

    // We need to go deeper …
    for (var u = 1; u < Tl - 1; u++) {
      // Build conditional histograms with log-scale bars
      var TH1 = {};
      var dep = 0;

      for (var _i4 = u; _i4 < Tl; _i4++) {
        var seq = T.slice(_i4 - u, _i4).map(_tB).join(' ');
        var _b2 = _tB(T[_i4]);

        TH1[seq] = TH1[seq] || {};
        TH1[seq][_b2] |= 0;
        TH1[seq][_b2]++;

        if (TH1[seq][_b2] > 1) dep++;
      }

      if (!dep) break;

      // Higher-order estimation
      var th1 = _shannon1(TH0, TH1, _tI) * (Tl - u);
      if ((th0 - th1) / th0 < 0.01) {
        th0 = th1;
        break;
      }

      // Flatten H1
      TH0 = {};
      for (var a in TH1) {
        if (!TH1[a]) continue;
        for (var _b3 in TH1[a]) {
          if (!TH1[a][_b3]) continue;
          TH0[a + ' ' + _b3] = TH1[a][_b3];
        }
      }
      th0 = th1;
    }

    for (var _u = 1; _u < Cl - 1; _u++) {
      // Build conditional histograms with log-scale bars
      var CH1 = {};
      var _dep = 0;
      for (var _i5 = _u; _i5 < Cl; _i5++) {
        var _seq = C.slice(_i5 - _u, _i5).map(_coordBar).join(' ');
        var _b4 = _coordBar(C[_i5]);
        CH1[_seq] = CH1[_seq] || {};
        CH1[_seq][_b4] |= 0;
        CH1[_seq][_b4]++;

        if (CH1[_seq][_b4] > 1) _dep++;
      }

      if (!_dep) break;

      // Higher-order estimation
      var ch1 = _shannon1(CH0, CH1, _coordInterval) * (Cl - _u);
      if ((ch0 - ch1) / ch0 < 0.01) {
        ch0 = ch1;
        break;
      }
      // Flatten H1
      CH0 = {};
      for (var _a in CH1) {
        if (!CH1[_a]) continue;
        for (var _b5 in CH1[_a]) {
          if (!CH1[_a][_b5]) continue;
          CH0[_a + ' ' + _b5] = CH1[_a][_b5];
        }
      }
      ch0 = ch1;
    }
    _estimatedEntropy = floor(th0 / LN2) + floor(ch0 / LN2);
    return _estimatedEntropy;
  }

  return {
    get eventTarget() {
      return _eventTarget;
    },
    set eventTarget(e) {
      stop();
      _eventTarget = e;
    },

    get eventsCaptured() {
      return min(_eventCounter, _bufferSize);
    },

    get estimatedEntropy() {
      return estimate();
    },

    get buffer() {
      return _buffer;
    },

    start: start,
    stop: stop
  };
}

exports.default = EntropyCollector;
//# sourceMappingURL=entropy.js.map
