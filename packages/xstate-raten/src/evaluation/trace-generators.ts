/**
 * Trace Generators for RATEN Evaluation
 *
 * Generates execution traces for:
 * - Single mode: One failure occurrence per execution
 * - Sequential mode: Multiple failures with recovery between them
 * - Nested mode: Multiple failures before recovery completes
 */

import type { Trace } from "../types";
import type { CRFType, MutantResult } from "./mutant-generators";
import { generateMutant, generateCompoundMutant } from "./mutant-generators";
import {
  TRACE_GENERATION_CONFIG,
  MUTATION_CONFIG,
  FAILURE_GENERATION_CONFIG,
} from "./constants";

/**
 * Execution modes
 */
export type ExecutionMode = "Single" | "Sequential" | "Nested";

/**
 * Testing strategies
 */
export type TestingStrategy = "Basic" | "Compound";

/**
 * Trace generation configuration
 */
export interface TraceGeneratorConfig {
  /** Number of traces to generate */
  traceCount: number;
  /** Average length of each trace */
  averageTraceLength: number;
  /** Variance in trace length */
  traceLengthVariance: number;
  /** Execution mode */
  mode: ExecutionMode;
  /** Testing strategy */
  strategy: TestingStrategy;
  /** CRF types to inject (for compound strategy) */
  crfTypes: CRFType[];
  /** Events available in the model */
  availableEvents: string[];
  /** Recovery events (to return to good state) */
  recoveryEvents: string[];
  /** Probability of taking recovery action */
  recoveryProbability: number;
}

/**
 * Generated trace set
 */
export interface TraceSet {
  /** All generated traces */
  traces: Trace[][];
  /** Mutated versions of traces */
  mutatedTraces: MutantResult[];
  /** Configuration used */
  config: TraceGeneratorConfig;
  /** Metadata about generation */
  metadata: {
    totalEvents: number;
    averageLength: number;
    executionMode: ExecutionMode;
    strategy: TestingStrategy;
    expectedViolations: number;
  };
}

/**
 * Default events for different models
 */
export const MODEL_EVENTS: Record<
  string,
  { normal: string[]; recovery: string[] }
> = {
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
function generateSingleTrace(
  events: string[],
  length: number,
  variance: number
): Trace[] {
  const actualLength = Math.max(
    1,
    Math.round(length + (Math.random() - 0.5) * variance * 2)
  );
  const trace: Trace[] = [];

  for (let i = 0; i < actualLength; i++) {
    const event = events[Math.floor(Math.random() * events.length)];
    trace.push({
      event,
      message: {
        timestamp:
          Date.now() + i * TRACE_GENERATION_CONFIG.EVENT_TIME_INTERVAL_MS,
        index: i,
        data: {
          value: Math.random() * TRACE_GENERATION_CONFIG.DATA_VALUE_RANGE,
        },
      },
    });
  }

  return trace;
}

/**
 * Generate traces for Single mode
 * One failure occurrence per execution
 */
function generateSingleModeTraces(config: TraceGeneratorConfig): {
  traces: Trace[][];
  mutants: MutantResult[];
} {
  const traces: Trace[][] = [];
  const mutants: MutantResult[] = [];

  for (let i = 0; i < config.traceCount; i++) {
    const trace = generateSingleTrace(
      config.availableEvents,
      config.averageTraceLength,
      config.traceLengthVariance
    );
    traces.push(trace);

    // Inject single CRF at random position
    const crfType =
      config.crfTypes[Math.floor(Math.random() * config.crfTypes.length)];
    const injectionPos = Math.floor(Math.random() * trace.length);

    if (config.strategy === "Basic") {
      mutants.push(
        generateMutant(trace, crfType, {
          injectionRate: 0,
          injectionPositions: [injectionPos],
        })
      );
    } else {
      mutants.push(
        generateCompoundMutant(trace, config.crfTypes, {
          injectionRate: MUTATION_CONFIG.COMPOUND_INJECTION_RATE,
        })
      );
    }
  }

  return { traces, mutants };
}

/**
 * Generate traces for Sequential mode
 * Multiple failures with recovery between them
 */
function generateSequentialModeTraces(config: TraceGeneratorConfig): {
  traces: Trace[][];
  mutants: MutantResult[];
} {
  const traces: Trace[][] = [];
  const mutants: MutantResult[] = [];

  for (let i = 0; i < config.traceCount; i++) {
    const trace: Trace[] = [];
    const failurePoints: number[] = [];

    // Random number of failures within configured range
    const numFailures =
      FAILURE_GENERATION_CONFIG.SEQUENTIAL_FAILURES_MIN +
      Math.floor(
        Math.random() *
          (FAILURE_GENERATION_CONFIG.SEQUENTIAL_FAILURES_MAX -
            FAILURE_GENERATION_CONFIG.SEQUENTIAL_FAILURES_MIN +
            1)
      );

    let currentPos = 0;
    for (let f = 0; f < numFailures; f++) {
      // Normal execution segment
      const segmentLength = Math.floor(
        config.averageTraceLength / (numFailures + 1)
      );
      for (let j = 0; j < segmentLength; j++) {
        const event =
          config.availableEvents[
            Math.floor(Math.random() * config.availableEvents.length)
          ];
        trace.push({
          event,
          message: {
            timestamp:
              Date.now() +
              currentPos * TRACE_GENERATION_CONFIG.EVENT_TIME_INTERVAL_MS,
            index: currentPos,
          },
        });
        currentPos++;
      }

      // Mark failure point
      failurePoints.push(currentPos);

      // Add recovery events (random length within configured range)
      const recoveryLength =
        FAILURE_GENERATION_CONFIG.SEQUENTIAL_RECOVERY_LENGTH_MIN +
        Math.floor(
          Math.random() *
            (FAILURE_GENERATION_CONFIG.SEQUENTIAL_RECOVERY_LENGTH_MAX -
              FAILURE_GENERATION_CONFIG.SEQUENTIAL_RECOVERY_LENGTH_MIN +
              1)
        );
      for (let r = 0; r < recoveryLength; r++) {
        const recoveryEvent =
          config.recoveryEvents[
            Math.floor(Math.random() * config.recoveryEvents.length)
          ];
        trace.push({
          event: recoveryEvent,
          message: {
            timestamp:
              Date.now() +
              currentPos * TRACE_GENERATION_CONFIG.EVENT_TIME_INTERVAL_MS,
            index: currentPos,
            recovery: true,
          },
        });
        currentPos++;
      }
    }

    traces.push(trace);

    // Generate mutant with failures at specified points
    const crfType =
      config.crfTypes[Math.floor(Math.random() * config.crfTypes.length)];
    if (config.strategy === "Basic") {
      mutants.push(
        generateMutant(trace, crfType, {
          injectionPositions: failurePoints,
        })
      );
    } else {
      mutants.push(
        generateCompoundMutant(trace, config.crfTypes, {
          injectionPositions: failurePoints,
        })
      );
    }
  }

  return { traces, mutants };
}

/**
 * Generate traces for Nested mode
 * Multiple failures before recovery completes (cascading)
 */
function generateNestedModeTraces(config: TraceGeneratorConfig): {
  traces: Trace[][];
  mutants: MutantResult[];
} {
  const traces: Trace[][] = [];
  const mutants: MutantResult[] = [];

  for (let i = 0; i < config.traceCount; i++) {
    const trace: Trace[] = [];
    const failurePoints: number[] = [];

    // Initial normal segment
    const initialLength = Math.floor(
      config.averageTraceLength *
        FAILURE_GENERATION_CONFIG.NESTED_INITIAL_SEGMENT_FRACTION
    );
    for (let j = 0; j < initialLength; j++) {
      const event =
        config.availableEvents[
          Math.floor(Math.random() * config.availableEvents.length)
        ];
      trace.push({
        event,
        message: {
          timestamp:
            Date.now() + j * TRACE_GENERATION_CONFIG.EVENT_TIME_INTERVAL_MS,
          index: j,
        },
      });
    }

    // Nested failure segment - failures occur before recovery completes
    const nestedDepth =
      FAILURE_GENERATION_CONFIG.NESTED_DEPTH_MIN +
      Math.floor(
        Math.random() *
          (FAILURE_GENERATION_CONFIG.NESTED_DEPTH_MAX -
            FAILURE_GENERATION_CONFIG.NESTED_DEPTH_MIN +
            1)
      );
    let currentPos = initialLength;

    for (let depth = 0; depth < nestedDepth; depth++) {
      // Mark failure point
      failurePoints.push(currentPos);

      // Add some events (simulating partial recovery attempt)
      const partialRecovery =
        FAILURE_GENERATION_CONFIG.NESTED_PARTIAL_RECOVERY_MIN +
        Math.floor(
          Math.random() *
            (FAILURE_GENERATION_CONFIG.NESTED_PARTIAL_RECOVERY_MAX -
              FAILURE_GENERATION_CONFIG.NESTED_PARTIAL_RECOVERY_MIN +
              1)
        );
      for (let p = 0; p < partialRecovery; p++) {
        const event =
          Math.random() <
          TRACE_GENERATION_CONFIG.NESTED_RECOVERY_VS_NORMAL_PROBABILITY
            ? config.recoveryEvents[
                Math.floor(Math.random() * config.recoveryEvents.length)
              ]
            : config.availableEvents[
                Math.floor(Math.random() * config.availableEvents.length)
              ];
        trace.push({
          event,
          message: {
            timestamp:
              Date.now() +
              currentPos * TRACE_GENERATION_CONFIG.EVENT_TIME_INTERVAL_MS,
            index: currentPos,
            nestedLevel: depth,
          },
        });
        currentPos++;
      }
    }

    // Final recovery segment
    const recoveryLength =
      FAILURE_GENERATION_CONFIG.NESTED_FINAL_RECOVERY_MIN +
      Math.floor(
        Math.random() *
          (FAILURE_GENERATION_CONFIG.NESTED_FINAL_RECOVERY_MAX -
            FAILURE_GENERATION_CONFIG.NESTED_FINAL_RECOVERY_MIN +
            1)
      );
    for (let r = 0; r < recoveryLength; r++) {
      const recoveryEvent =
        config.recoveryEvents[
          Math.floor(Math.random() * config.recoveryEvents.length)
        ];
      trace.push({
        event: recoveryEvent,
        message: {
          timestamp:
            Date.now() +
            currentPos * TRACE_GENERATION_CONFIG.EVENT_TIME_INTERVAL_MS,
          index: currentPos,
          finalRecovery: true,
        },
      });
      currentPos++;
    }

    traces.push(trace);

    // Generate mutant with nested failures
    const crfType =
      config.crfTypes[Math.floor(Math.random() * config.crfTypes.length)];
    if (config.strategy === "Basic") {
      mutants.push(
        generateMutant(trace, crfType, {
          injectionPositions: failurePoints,
        })
      );
    } else {
      mutants.push(
        generateCompoundMutant(trace, config.crfTypes, {
          injectionPositions: failurePoints,
        })
      );
    }
  }

  return { traces, mutants };
}

/**
 * Main trace generator function
 */
export function generateTraces(
  config: Partial<TraceGeneratorConfig> & { modelKey?: string }
): TraceSet {
  // Get model-specific events if model key provided
  const modelEvents = config.modelKey
    ? MODEL_EVENTS[config.modelKey]
    : undefined;

  const fullConfig: TraceGeneratorConfig = {
    traceCount:
      config.traceCount ?? TRACE_GENERATION_CONFIG.DEFAULT_TRACE_COUNT,
    averageTraceLength:
      config.averageTraceLength ??
      TRACE_GENERATION_CONFIG.DEFAULT_AVERAGE_LENGTH,
    traceLengthVariance:
      config.traceLengthVariance ??
      TRACE_GENERATION_CONFIG.DEFAULT_LENGTH_VARIANCE,
    mode: config.mode ?? "Single",
    strategy: config.strategy ?? "Basic",
    crfTypes: config.crfTypes ?? ["WM"],
    availableEvents: config.availableEvents ??
      modelEvents?.normal ?? ["EVENT_A", "EVENT_B", "EVENT_C"],
    recoveryEvents: config.recoveryEvents ??
      modelEvents?.recovery ?? ["RECOVER", "RETRY"],
    recoveryProbability:
      config.recoveryProbability ??
      TRACE_GENERATION_CONFIG.DEFAULT_RECOVERY_PROBABILITY,
  };

  let result: { traces: Trace[][]; mutants: MutantResult[] };

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
      throw new Error(`Unknown execution mode: ${fullConfig.mode}`);
  }

  // Calculate metadata
  const totalEvents = result.traces.reduce((sum, t) => sum + t.length, 0);
  const expectedViolations = result.mutants.filter(
    (m) => m.expectedBadState
  ).length;

  return {
    traces: result.traces,
    mutatedTraces: result.mutants,
    config: fullConfig,
    metadata: {
      totalEvents,
      averageLength: totalEvents / result.traces.length,
      executionMode: fullConfig.mode,
      strategy: fullConfig.strategy,
      expectedViolations,
    },
  };
}

/**
 * Generate traces for all case studies
 */
export function generateAllCaseStudyTraces(
  traceCount: number = TRACE_GENERATION_CONFIG.DEFAULT_TRACE_COUNT,
  mode: ExecutionMode = "Single",
  strategy: TestingStrategy = "Basic",
  crfTypes: CRFType[] = ["WM"]
): Record<string, TraceSet> {
  const modelKeys = ["CM", "PR", "RO", "FO"];
  const result: Record<string, TraceSet> = {};

  modelKeys.forEach((modelKey) => {
    result[modelKey] = generateTraces({
      modelKey,
      traceCount,
      mode,
      strategy,
      crfTypes,
    });
  });

  return result;
}

/**
 * Generate large trace set for evaluation (100,000 traces)
 */
export function generateEvaluationTraces(
  modelKey: string,
  mode: ExecutionMode,
  strategy: TestingStrategy,
  crfType: CRFType
): TraceSet {
  return generateTraces({
    modelKey,
    traceCount: TRACE_GENERATION_CONFIG.EVALUATION_TRACE_COUNT,
    averageTraceLength: TRACE_GENERATION_CONFIG.EVALUATION_AVERAGE_LENGTH,
    traceLengthVariance: TRACE_GENERATION_CONFIG.EVALUATION_LENGTH_VARIANCE,
    mode,
    strategy,
    crfTypes: strategy === "Basic" ? [crfType] : ["WM", "WP", "MM"],
  });
}
