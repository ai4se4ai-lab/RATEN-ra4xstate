"use strict";
/**
 * Trace Generators for RATEN Evaluation
 *
 * Generates execution traces for:
 * - Single mode: One failure occurrence per execution
 * - Sequential mode: Multiple failures with recovery between them
 * - Nested mode: Multiple failures before recovery completes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEvaluationTraces =
  exports.generateAllCaseStudyTraces =
  exports.generateTraces =
  exports.MODEL_EVENTS =
    void 0;
var mutant_generators_1 = require("./mutant-generators");
/**
 * Default events for different models
 */
exports.MODEL_EVENTS = {
  CM: {
    normal: [
      "EDIT",
      "SAVE",
      "CANCEL",
      "SUBMIT",
      "APPROVE",
      "REJECT",
      "UNPUBLISH",
      "ARCHIVE",
      "RESTORE",
      "DELETE",
    ],
    recovery: ["RECOVER", "RETRY", "CANCEL"],
  },
  PR: {
    normal: [
      "RECEIVE_PARCEL",
      "SCAN_SUCCESS",
      "VALIDATE",
      "CLASSIFY",
      "LOCAL",
      "REGIONAL",
      "NATIONAL",
      "ARRIVED",
      "DELIVER",
      "DELIVERED",
    ],
    recovery: ["RETRY", "RESUME", "RETURN"],
  },
  RO: {
    normal: [
      "POWER_ON",
      "START_TASK",
      "PLAN_READY",
      "DESTINATION_REACHED",
      "TASK_COMPLETE",
      "BASE_REACHED",
      "CHARGE_COMPLETE",
      "SHUTDOWN",
    ],
    recovery: ["RECOVER", "RETRY", "ABORT", "MANUAL_ASSIST", "AUTO_RECOVER"],
  },
  FO: {
    normal: [
      "POWER_ON",
      "PRIMARY_READY",
      "PRIMARY_STARTED",
      "HEALTH_CHECK",
      "HEALTHY",
      "SYNC_BACKUP",
      "SYNC_COMPLETE",
      "SHUTDOWN",
    ],
    recovery: ["RECOVERED", "RETRY", "FAILOVER", "FAILBACK", "EMERGENCY"],
  },
};
/**
 * Generate a single random trace
 */
function generateSingleTrace(events, length, variance) {
  var actualLength = Math.max(
    1,
    Math.round(length + (Math.random() - 0.5) * variance * 2)
  );
  var trace = [];
  for (var i = 0; i < actualLength; i++) {
    var event_1 = events[Math.floor(Math.random() * events.length)];
    trace.push({
      event: event_1,
      message: {
        timestamp: Date.now() + i * 100,
        index: i,
        data: { value: Math.random() * 100 },
      },
    });
  }
  return trace;
}
/**
 * Generate traces for Single mode
 * One failure occurrence per execution
 */
function generateSingleModeTraces(config) {
  var traces = [];
  var mutants = [];
  for (var i = 0; i < config.traceCount; i++) {
    var trace = generateSingleTrace(
      config.availableEvents,
      config.averageTraceLength,
      config.traceLengthVariance
    );
    traces.push(trace);
    // Inject single CRF at random position
    var crfType =
      config.crfTypes[Math.floor(Math.random() * config.crfTypes.length)];
    var injectionPos = Math.floor(Math.random() * trace.length);
    if (config.strategy === "Basic") {
      mutants.push(
        (0, mutant_generators_1.generateMutant)(trace, crfType, {
          injectionRate: 0,
          injectionPositions: [injectionPos],
        })
      );
    } else {
      mutants.push(
        (0, mutant_generators_1.generateCompoundMutant)(
          trace,
          config.crfTypes,
          {
            injectionRate: 0.05,
          }
        )
      );
    }
  }
  return { traces: traces, mutants: mutants };
}
/**
 * Generate traces for Sequential mode
 * Multiple failures with recovery between them
 */
function generateSequentialModeTraces(config) {
  var traces = [];
  var mutants = [];
  for (var i = 0; i < config.traceCount; i++) {
    var trace = [];
    var failurePoints = [];
    var numFailures = 2 + Math.floor(Math.random() * 3); // 2-4 failures
    var currentPos = 0;
    for (var f = 0; f < numFailures; f++) {
      // Normal execution segment
      var segmentLength = Math.floor(
        config.averageTraceLength / (numFailures + 1)
      );
      for (var j = 0; j < segmentLength; j++) {
        var event_2 =
          config.availableEvents[
            Math.floor(Math.random() * config.availableEvents.length)
          ];
        trace.push({
          event: event_2,
          message: {
            timestamp: Date.now() + currentPos * 100,
            index: currentPos,
          },
        });
        currentPos++;
      }
      // Mark failure point
      failurePoints.push(currentPos);
      // Add recovery events
      var recoveryLength = 1 + Math.floor(Math.random() * 2);
      for (var r = 0; r < recoveryLength; r++) {
        var recoveryEvent =
          config.recoveryEvents[
            Math.floor(Math.random() * config.recoveryEvents.length)
          ];
        trace.push({
          event: recoveryEvent,
          message: {
            timestamp: Date.now() + currentPos * 100,
            index: currentPos,
            recovery: true,
          },
        });
        currentPos++;
      }
    }
    traces.push(trace);
    // Generate mutant with failures at specified points
    var crfType =
      config.crfTypes[Math.floor(Math.random() * config.crfTypes.length)];
    if (config.strategy === "Basic") {
      mutants.push(
        (0, mutant_generators_1.generateMutant)(trace, crfType, {
          injectionPositions: failurePoints,
        })
      );
    } else {
      mutants.push(
        (0, mutant_generators_1.generateCompoundMutant)(
          trace,
          config.crfTypes,
          {
            injectionPositions: failurePoints,
          }
        )
      );
    }
  }
  return { traces: traces, mutants: mutants };
}
/**
 * Generate traces for Nested mode
 * Multiple failures before recovery completes (cascading)
 */
function generateNestedModeTraces(config) {
  var traces = [];
  var mutants = [];
  for (var i = 0; i < config.traceCount; i++) {
    var trace = [];
    var failurePoints = [];
    // Initial normal segment
    var initialLength = Math.floor(config.averageTraceLength * 0.3);
    for (var j = 0; j < initialLength; j++) {
      var event_3 =
        config.availableEvents[
          Math.floor(Math.random() * config.availableEvents.length)
        ];
      trace.push({
        event: event_3,
        message: { timestamp: Date.now() + j * 100, index: j },
      });
    }
    // Nested failure segment - failures occur before recovery completes
    var nestedDepth = 2 + Math.floor(Math.random() * 2); // 2-3 nested levels
    var currentPos = initialLength;
    for (var depth = 0; depth < nestedDepth; depth++) {
      // Mark failure point
      failurePoints.push(currentPos);
      // Add some events (simulating partial recovery attempt)
      var partialRecovery = 1 + Math.floor(Math.random() * 2);
      for (var p = 0; p < partialRecovery; p++) {
        var event_4 =
          Math.random() < 0.5
            ? config.recoveryEvents[
                Math.floor(Math.random() * config.recoveryEvents.length)
              ]
            : config.availableEvents[
                Math.floor(Math.random() * config.availableEvents.length)
              ];
        trace.push({
          event: event_4,
          message: {
            timestamp: Date.now() + currentPos * 100,
            index: currentPos,
            nestedLevel: depth,
          },
        });
        currentPos++;
      }
    }
    // Final recovery segment
    var recoveryLength = 2 + Math.floor(Math.random() * 3);
    for (var r = 0; r < recoveryLength; r++) {
      var recoveryEvent =
        config.recoveryEvents[
          Math.floor(Math.random() * config.recoveryEvents.length)
        ];
      trace.push({
        event: recoveryEvent,
        message: {
          timestamp: Date.now() + currentPos * 100,
          index: currentPos,
          finalRecovery: true,
        },
      });
      currentPos++;
    }
    traces.push(trace);
    // Generate mutant with nested failures
    var crfType =
      config.crfTypes[Math.floor(Math.random() * config.crfTypes.length)];
    if (config.strategy === "Basic") {
      mutants.push(
        (0, mutant_generators_1.generateMutant)(trace, crfType, {
          injectionPositions: failurePoints,
        })
      );
    } else {
      mutants.push(
        (0, mutant_generators_1.generateCompoundMutant)(
          trace,
          config.crfTypes,
          {
            injectionPositions: failurePoints,
          }
        )
      );
    }
  }
  return { traces: traces, mutants: mutants };
}
/**
 * Main trace generator function
 */
function generateTraces(config) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
  // Get model-specific events if model key provided
  var modelEvents = config.modelKey
    ? exports.MODEL_EVENTS[config.modelKey]
    : undefined;
  var fullConfig = {
    traceCount: (_a = config.traceCount) !== null && _a !== void 0 ? _a : 1000,
    averageTraceLength:
      (_b = config.averageTraceLength) !== null && _b !== void 0 ? _b : 20,
    traceLengthVariance:
      (_c = config.traceLengthVariance) !== null && _c !== void 0 ? _c : 5,
    mode: (_d = config.mode) !== null && _d !== void 0 ? _d : "Single",
    strategy: (_e = config.strategy) !== null && _e !== void 0 ? _e : "Basic",
    crfTypes: (_f = config.crfTypes) !== null && _f !== void 0 ? _f : ["WM"],
    availableEvents:
      (_h =
        (_g = config.availableEvents) !== null && _g !== void 0
          ? _g
          : modelEvents === null || modelEvents === void 0
          ? void 0
          : modelEvents.normal) !== null && _h !== void 0
        ? _h
        : ["EVENT_A", "EVENT_B", "EVENT_C"],
    recoveryEvents:
      (_k =
        (_j = config.recoveryEvents) !== null && _j !== void 0
          ? _j
          : modelEvents === null || modelEvents === void 0
          ? void 0
          : modelEvents.recovery) !== null && _k !== void 0
        ? _k
        : ["RECOVER", "RETRY"],
    recoveryProbability:
      (_l = config.recoveryProbability) !== null && _l !== void 0 ? _l : 0.7,
  };
  var result;
  switch (fullConfig.mode) {
    case "Single":
      result = generateSingleModeTraces(fullConfig);
      break;
    case "Sequential":
      result = generateSequentialModeTraces(fullConfig);
      break;
    case "Nested":
      result = generateNestedModeTraces(fullConfig);
      break;
    default:
      throw new Error("Unknown execution mode: ".concat(fullConfig.mode));
  }
  // Calculate metadata
  var totalEvents = result.traces.reduce(function (sum, t) {
    return sum + t.length;
  }, 0);
  var expectedViolations = result.mutants.filter(function (m) {
    return m.expectedBadState;
  }).length;
  return {
    traces: result.traces,
    mutatedTraces: result.mutants,
    config: fullConfig,
    metadata: {
      totalEvents: totalEvents,
      averageLength: totalEvents / result.traces.length,
      executionMode: fullConfig.mode,
      strategy: fullConfig.strategy,
      expectedViolations: expectedViolations,
    },
  };
}
exports.generateTraces = generateTraces;
/**
 * Generate traces for all case studies
 */
function generateAllCaseStudyTraces(traceCount, mode, strategy, crfTypes) {
  if (traceCount === void 0) {
    traceCount = 1000;
  }
  if (mode === void 0) {
    mode = "Single";
  }
  if (strategy === void 0) {
    strategy = "Basic";
  }
  if (crfTypes === void 0) {
    crfTypes = ["WM"];
  }
  var modelKeys = ["CM", "PR", "RO", "FO"];
  var result = {};
  modelKeys.forEach(function (modelKey) {
    result[modelKey] = generateTraces({
      modelKey: modelKey,
      traceCount: traceCount,
      mode: mode,
      strategy: strategy,
      crfTypes: crfTypes,
    });
  });
  return result;
}
exports.generateAllCaseStudyTraces = generateAllCaseStudyTraces;
/**
 * Generate large trace set for evaluation (100,000 traces)
 */
function generateEvaluationTraces(modelKey, mode, strategy, crfType) {
  return generateTraces({
    modelKey: modelKey,
    traceCount: 100000,
    averageTraceLength: 25,
    traceLengthVariance: 10,
    mode: mode,
    strategy: strategy,
    crfTypes: strategy === "Basic" ? [crfType] : ["WM", "WP", "MM"],
  });
}
exports.generateEvaluationTraces = generateEvaluationTraces;
