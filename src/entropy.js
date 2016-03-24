/*
  From https://github.com/vibornoff/entropy-collector.js
 */

function EntropyCollector(global) {
  const min = Math.min;
  const max = Math.max;
  const abs = Math.abs;
  const floor = Math.floor;
  const log = Math.log;
  const pow = Math.pow;
  const atan2 = Math.atan2;
  const LN2 = Math.LN2;
  const PI = Math.PI;

  const _dateNow = global.Date.now;
  const _perf = global.performance;
  let _perfTiming;
  let _perfNow;

  if (_perf) {
    _perfTiming = _perf.timing;
    _perfNow = _perf.now;
  }

  // Timestamping
  let now;
  let _timeStart;
  let _timePrecision;

  _timeStart = 0;

  if (_perfNow) {
    now = () => 1000 * _perf.now() | 0;
    _timePrecision = 1;
  } else {
    _timeStart = (_perfTiming) ? _perfTiming.navigationStart : _dateNow();
    now = () => 1000 * (_dateNow() - _timeStart) | 0;
    _timePrecision = 1000;
  }

  // EventTarget to bind to
  let _eventTarget = global.document || global;

  // Buffer for events
  const _bufferSize = 1024;
  let _buffer = new Int32Array(2 * _bufferSize);

  // Collected events

  // MAYBE TODO _entropy_mic_events, _entropy_cam_events
  let _timeEvents = _buffer.subarray(0, _bufferSize);
  let _coordEvents = _buffer.subarray(_bufferSize);
  let _eventCounter = 0;
  let _estimatedEntropy = 0;

  // Collectors
  let _lastT = 0;
  let _lastX = 0;
  let _lastY = 0;

  function _mouseCollector(e) {
    const i = _eventCounter % _bufferSize;
    const t = now();
    const x = e.screenX;
    const y = e.screenY;

    if (_eventCounter) {
      _timeEvents[i] = max(t - _lastT, 0);
      _coordEvents[i] = (x - _lastX << 16) | (y - _lastY & 0xffff);
    }

    _lastT = t;
    _lastX = x;
    _lastY = y;
    _eventCounter++;
  }

  function _touchCollector(e) {
    for (let i = 0; i < e.touches.length; i++) {
      _mouseCollector(e.touches[i]);
    }
  }

  function _keyboardCollector() {
    const i = _eventCounter % _bufferSize;
    const t = now();

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
    let n = 0;

    for (const k in A) {
      if (typeof A[k] !== 'undefined') {
        n += A[k];
      }
    }

    if (!n) {
      return 0;
    }

    let h = 0;

    for (const k in A) {
      if (typeof A[k] !== 'undefined') {
        const p = A[k] / n;
        const w = W(k); // eslint-disable-line
        if (!w) continue;
        h -= p * log(p / w);
      }
    }
    return h;
  }

  function _shannon1(A, B, W) {
    let n = 0;
    for (const k in A) {
      if (typeof A[k] !== 'undefined') {
        n += A[k];
      }
    }

    if (!n) return 0;

    let h = 0;

    for (const k in A) {
      if (!B[k]) continue;
      h += (A[k] / n) * _shannon0(B[k], W);
    }

    return h;
  }

  function _timeMedian(X) {
    const Y = X.sort((a, b) => a - b);
    return Y[floor(Y.length / 2)];
  }

  function _timeBar(t, m) {
    const d = abs(t - m) / _timePrecision;
    const b = floor(log(1 + d) / LN2);
    return (t < 0) ? -b : b;
  }

  function _timeInterval(b, m) {
    const s = (b < 0) ? -1 : 1;
    let t0 = m + s * (pow(2, abs(b)) - 1);
    let t1 = m + s * (pow(2, abs(b) + 1) - 1);
    if (t0 < 0) t0 = 0;
    if (t1 < 0) t1 = 0;
    return abs(t1 - t0) * _timePrecision;
  }

  function _coordBar(c) {
    const x = c >> 16;
    const y = (c << 16) >> 16;
    const s = PI * (x * x + y * y) / 16;
    let a = atan2(y, x);
    if (a === PI) a = -PI;
    return (floor(log(1 + s) / LN2) << 4) | (8 * (a + PI) / PI);
  }

  function _coordInterval(b) {
    const s0 = pow(2, (b >>> 4)) - 1;
    const s1 = pow(2, (b >>> 4) + 1) - 1;
    return s1 - s0;
  }

  function estimate() {
    // Filter out repeated events
    // though it causes some underestimation, it's ok

    const T = [_timeEvents[0]];
    for (let i = 1; i < _bufferSize; i++) {
      if (_timeEvents[i] === _timeEvents[i - 1]) continue;
      T.push(_timeEvents[i]);
    }

    const C = [_coordEvents[0]];
    for (let i = 1; i < _bufferSize; i++) {
      if (_coordEvents[i] === _coordEvents[i - 1]) continue;
      C.push(_coordEvents[i]);
    }

    // Calculate time values median
    const Tm = _timeMedian(T);

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

    let TH0 = {};
    const Tl = T.length;

    for (let i = 0; i < Tl; i++) {
      const b = _tB(T[i]);
      TH0[b] |= 0;
      TH0[b]++;
    }

    let CH0 = {};
    const Cl = C.length;

    for (let i = 0; i < Cl; i++) {
      const b = _coordBar(C[i]);
      CH0[b] |= 0;
      CH0[b]++;
    }

    // First-order estimation
    let th0 = _shannon0(TH0, _tI) * Tl;
    let ch0 = _shannon0(CH0, _cI) * Cl;

    // We need to go deeper …
    for (let u = 1; u < Tl - 1; u++) {
      // Build conditional histograms with log-scale bars
      const TH1 = {};
      let dep = 0;

      for (let i = u; i < Tl; i++) {
        const seq = T.slice(i - u, i).map(_tB).join(' ');
        const b = _tB(T[i]);

        TH1[seq] = TH1[seq] || {};
        TH1[seq][b] |= 0;
        TH1[seq][b]++;

        if (TH1[seq][b] > 1) dep++;
      }

      if (!dep) break;

      // Higher-order estimation
      const th1 = _shannon1(TH0, TH1, _tI) * (Tl - u);
      if ((th0 - th1) / th0 < 0.01) {
        th0 = th1;
        break;
      }

      // Flatten H1
      TH0 = {};
      for (const a in TH1) {
        if (!TH1[a]) continue;
        for (const b in TH1[a]) {
          if (!TH1[a][b]) continue;
          TH0[`${a} ${b}`] = TH1[a][b];
        }
      }
      th0 = th1;
    }

    for (let u = 1; u < Cl - 1; u++) {
      // Build conditional histograms with log-scale bars
      const CH1 = {};
      let dep = 0;
      for (let i = u; i < Cl; i++) {
        const seq = C.slice(i - u, i).map(_coordBar).join(' ');
        const b = _coordBar(C[i]);
        CH1[seq] = CH1[seq] || {};
        CH1[seq][b] |= 0;
        CH1[seq][b]++;

        if (CH1[seq][b] > 1) dep++;
      }

      if (!dep) break;

      // Higher-order estimation
      const ch1 = _shannon1(CH0, CH1, _coordInterval) * (Cl - u);
      if ((ch0 - ch1) / ch0 < 0.01) {
        ch0 = ch1;
        break;
      }
      // Flatten H1
      CH0 = {};
      for (const a in CH1) {
        if (!CH1[a]) continue;
        for (const b in CH1[a]) {
          if (!CH1[a][b]) continue;
          CH0[`${a} ${b}`] = CH1[a][b];
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
      return _buffer.buffer;
    },

    start,
    stop,
  };
}

export default EntropyCollector;
