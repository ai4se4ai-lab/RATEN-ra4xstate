"use strict";
/**
 * Mutant Generators for Common Robustness Failures (CRFs)
 *
 * Creates mutants by injecting:
 * - WM (Wrong Message): Unexpected message types
 * - WP (Wrong Payload): Malformed or invalid payload data
 * - MM (Missing Message): Missing expected messages/timeouts
 */
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMutantMetrics =
  exports.batchGenerateMutants =
  exports.generateCompoundMutant =
  exports.generateMutant =
  exports.generateMMmutant =
  exports.generateWPmutant =
  exports.generateWMmutant =
    void 0;
/**
 * Default wrong messages for WM mutations
 */
var DEFAULT_WRONG_MESSAGES = [
  "INVALID_EVENT",
  "UNKNOWN_ACTION",
  "UNEXPECTED_MESSAGE",
  "WRONG_TYPE",
  "MALFORMED_REQUEST",
  "UNSUPPORTED_OPERATION",
  "DEPRECATED_EVENT",
  "FORBIDDEN_ACTION",
];
/**
 * Default wrong payloads for WP mutations
 */
var DEFAULT_WRONG_PAYLOADS = [
  { value: null },
  { value: undefined },
  { value: NaN },
  { value: Infinity },
  { value: -Infinity },
  { value: "" },
  { value: [] },
  { value: {} },
  { data: { corrupted: true, original: null } },
  { id: -1 },
  { id: "invalid-id-format" },
  { timestamp: "not-a-date" },
  { count: -999999 },
  { status: "INVALID_STATUS" },
];
/**
 * Generate Wrong Message (WM) mutant
 * Replaces valid events with unexpected message types
 */
function generateWMmutant(traces, config) {
  if (config === void 0) {
    config = {};
  }
  var _a = config.injectionRate,
    injectionRate = _a === void 0 ? 0.1 : _a,
    _b = config.injectionPositions,
    injectionPositions = _b === void 0 ? [] : _b,
    _c = config.wrongMessages,
    wrongMessages = _c === void 0 ? DEFAULT_WRONG_MESSAGES : _c;
  var mutatedTrace = __spreadArray([], __read(traces), false);
  var injectionPoints = [];
  // Determine injection positions
  var positions =
    injectionPositions.length > 0
      ? injectionPositions
      : generateRandomPositions(traces.length, injectionRate);
  positions.forEach(function (pos) {
    if (pos >= 0 && pos < mutatedTrace.length) {
      var wrongMessage =
        wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
      mutatedTrace[pos] = __assign(__assign({}, mutatedTrace[pos]), {
        event: wrongMessage,
        message: __assign(__assign({}, mutatedTrace[pos].message), {
          __mutated: true,
          __originalEvent: traces[pos].event,
          __mutationType: "WM",
        }),
      });
      injectionPoints.push(pos);
    }
  });
  return {
    originalTrace: traces,
    mutatedTrace: mutatedTrace,
    injectionPoints: injectionPoints,
    crfType: "WM",
    expectedBadState: injectionPoints.length > 0,
  };
}
exports.generateWMmutant = generateWMmutant;
/**
 * Generate Wrong Payload (WP) mutant
 * Keeps valid event types but corrupts payload data
 */
function generateWPmutant(traces, config) {
  if (config === void 0) {
    config = {};
  }
  var _a = config.injectionRate,
    injectionRate = _a === void 0 ? 0.1 : _a,
    _b = config.injectionPositions,
    injectionPositions = _b === void 0 ? [] : _b,
    _c = config.wrongPayloads,
    wrongPayloads = _c === void 0 ? DEFAULT_WRONG_PAYLOADS : _c;
  var mutatedTrace = __spreadArray([], __read(traces), false);
  var injectionPoints = [];
  var positions =
    injectionPositions.length > 0
      ? injectionPositions
      : generateRandomPositions(traces.length, injectionRate);
  positions.forEach(function (pos) {
    if (pos >= 0 && pos < mutatedTrace.length) {
      var wrongPayload =
        wrongPayloads[Math.floor(Math.random() * wrongPayloads.length)];
      mutatedTrace[pos] = __assign(__assign({}, mutatedTrace[pos]), {
        message: __assign(__assign({}, wrongPayload), {
          __mutated: true,
          __originalPayload: traces[pos].message,
          __mutationType: "WP",
        }),
      });
      injectionPoints.push(pos);
    }
  });
  return {
    originalTrace: traces,
    mutatedTrace: mutatedTrace,
    injectionPoints: injectionPoints,
    crfType: "WP",
    expectedBadState: injectionPoints.length > 0,
  };
}
exports.generateWPmutant = generateWPmutant;
/**
 * Generate Missing Message (MM) mutant
 * Removes expected messages to simulate timeout/missing scenarios
 */
function generateMMmutant(traces, config) {
  if (config === void 0) {
    config = {};
  }
  var _a = config.injectionRate,
    injectionRate = _a === void 0 ? 0.1 : _a,
    _b = config.injectionPositions,
    injectionPositions = _b === void 0 ? [] : _b,
    _c = config.missingMessageTimeout,
    missingMessageTimeout = _c === void 0 ? 5000 : _c;
  var mutatedTrace = [];
  var injectionPoints = [];
  var positions =
    injectionPositions.length > 0
      ? injectionPositions
      : generateRandomPositions(traces.length, injectionRate);
  traces.forEach(function (trace, index) {
    if (positions.includes(index)) {
      // Replace with timeout event instead of original message
      mutatedTrace.push({
        event: "TIMEOUT",
        message: {
          __mutated: true,
          __originalEvent: trace.event,
          __originalPayload: trace.message,
          __mutationType: "MM",
          __timeout: missingMessageTimeout,
        },
      });
      injectionPoints.push(index);
    } else {
      mutatedTrace.push(trace);
    }
  });
  return {
    originalTrace: traces,
    mutatedTrace: mutatedTrace,
    injectionPoints: injectionPoints,
    crfType: "MM",
    expectedBadState: injectionPoints.length > 0,
  };
}
exports.generateMMmutant = generateMMmutant;
/**
 * Generate random positions for injection
 */
function generateRandomPositions(length, rate) {
  var positions = [];
  for (var i = 0; i < length; i++) {
    if (Math.random() < rate) {
      positions.push(i);
    }
  }
  // Ensure at least one position if length > 0
  if (positions.length === 0 && length > 0) {
    positions.push(Math.floor(Math.random() * length));
  }
  return positions;
}
/**
 * Generate mutant based on CRF type
 */
function generateMutant(traces, crfType, config) {
  if (config === void 0) {
    config = {};
  }
  switch (crfType) {
    case "WM":
      return generateWMmutant(traces, config);
    case "WP":
      return generateWPmutant(traces, config);
    case "MM":
      return generateMMmutant(traces, config);
    default:
      throw new Error("Unknown CRF type: ".concat(crfType));
  }
}
exports.generateMutant = generateMutant;
/**
 * Generate compound mutant with multiple CRF types
 */
function generateCompoundMutant(traces, crfTypes, config) {
  if (config === void 0) {
    config = {};
  }
  var currentTraces = __spreadArray([], __read(traces), false);
  var allInjectionPoints = [];
  crfTypes.forEach(function (crfType) {
    var result = generateMutant(
      currentTraces,
      crfType,
      __assign(__assign({}, config), {
        injectionRate: (config.injectionRate || 0.1) / crfTypes.length,
      })
    );
    currentTraces = result.mutatedTrace;
    allInjectionPoints.push.apply(
      allInjectionPoints,
      __spreadArray([], __read(result.injectionPoints), false)
    );
  });
  return {
    originalTrace: traces,
    mutatedTrace: currentTraces,
    injectionPoints: __spreadArray(
      [],
      __read(new Set(allInjectionPoints)),
      false
    ).sort(function (a, b) {
      return a - b;
    }),
    crfType: "WM",
    expectedBadState: allInjectionPoints.length > 0,
  };
}
exports.generateCompoundMutant = generateCompoundMutant;
/**
 * Batch generate mutants for a set of traces
 */
function batchGenerateMutants(traces, count, crfType, config) {
  if (config === void 0) {
    config = {};
  }
  var results = [];
  for (var i = 0; i < count; i++) {
    results.push(generateMutant(traces, crfType, config));
  }
  return results;
}
exports.batchGenerateMutants = batchGenerateMutants;
function calculateMutantMetrics(mutants) {
  var crfDistribution = { WM: 0, WP: 0, MM: 0 };
  var totalInjectionPoints = 0;
  var expectedViolations = 0;
  mutants.forEach(function (mutant) {
    crfDistribution[mutant.crfType]++;
    totalInjectionPoints += mutant.injectionPoints.length;
    if (mutant.expectedBadState) {
      expectedViolations++;
    }
  });
  return {
    totalMutants: mutants.length,
    expectedViolations: expectedViolations,
    averageInjectionPoints: totalInjectionPoints / mutants.length,
    crfDistribution: crfDistribution,
  };
}
exports.calculateMutantMetrics = calculateMutantMetrics;
