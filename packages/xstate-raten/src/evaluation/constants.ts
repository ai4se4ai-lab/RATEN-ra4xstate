/**
 * RATEN Evaluation Constants
 *
 * Centralizes all configuration values and thresholds
 * for the evaluation code. No hardcoded expected results -
 * all results are computed from actual RATEN analysis.
 */

import type { CRFType } from "./mutant-generators";
import type { ExecutionMode } from "./trace-generators";

// ============================================================================
// TRACE GENERATION CONFIGURATION
// ============================================================================

/**
 * Default configuration for trace generation
 */
export const TRACE_GENERATION_CONFIG = {
  /** Default number of traces to generate */
  DEFAULT_TRACE_COUNT: 1000,

  /** Large evaluation trace count (per paper specification) */
  EVALUATION_TRACE_COUNT: 100000,

  /** Default average trace length */
  DEFAULT_AVERAGE_LENGTH: 20,

  /** Large evaluation average trace length */
  EVALUATION_AVERAGE_LENGTH: 25,

  /** Default trace length variance */
  DEFAULT_LENGTH_VARIANCE: 5,

  /** Large evaluation trace length variance */
  EVALUATION_LENGTH_VARIANCE: 10,

  /** Time interval between events in trace (ms) */
  EVENT_TIME_INTERVAL_MS: 100,

  /** Default recovery probability */
  DEFAULT_RECOVERY_PROBABILITY: 0.7,

  /** Probability of choosing recovery vs normal event in nested mode */
  NESTED_RECOVERY_VS_NORMAL_PROBABILITY: 0.5,

  /** Random data value range multiplier */
  DATA_VALUE_RANGE: 100,
} as const;

// ============================================================================
// MUTATION CONFIGURATION
// ============================================================================

/**
 * Default configuration for mutant generation
 */
export const MUTATION_CONFIG = {
  /** Default injection rate for mutants */
  DEFAULT_INJECTION_RATE: 0.1,

  /** Injection rate for compound mutants (per CRF type) */
  COMPOUND_INJECTION_RATE: 0.05,

  /** Default timeout for missing message (ms) */
  DEFAULT_MM_TIMEOUT_MS: 5000,
} as const;

// ============================================================================
// FAILURE GENERATION RANGES
// ============================================================================

/**
 * Configuration for failure injection in different modes
 */
export const FAILURE_GENERATION_CONFIG = {
  /** Sequential mode: min/max number of failures */
  SEQUENTIAL_FAILURES_MIN: 2,
  SEQUENTIAL_FAILURES_MAX: 4,

  /** Sequential mode: min/max recovery length */
  SEQUENTIAL_RECOVERY_LENGTH_MIN: 1,
  SEQUENTIAL_RECOVERY_LENGTH_MAX: 2,

  /** Nested mode: initial segment as fraction of total length */
  NESTED_INITIAL_SEGMENT_FRACTION: 0.3,

  /** Nested mode: min/max nested depth */
  NESTED_DEPTH_MIN: 2,
  NESTED_DEPTH_MAX: 3,

  /** Nested mode: min/max partial recovery length */
  NESTED_PARTIAL_RECOVERY_MIN: 1,
  NESTED_PARTIAL_RECOVERY_MAX: 2,

  /** Nested mode: min/max final recovery length */
  NESTED_FINAL_RECOVERY_MIN: 2,
  NESTED_FINAL_RECOVERY_MAX: 4,
} as const;

// ============================================================================
// EVALUATION METRICS CONFIGURATION
// ============================================================================

/**
 * Configuration for evaluation metrics
 */
export const EVALUATION_METRICS_CONFIG = {
  /** Assumed violation rate in test traces for confusion matrix */
  EXPECTED_VIOLATION_RATE: 0.5,

  /** Default CRF count for compound strategy */
  DEFAULT_CRF_COUNT: 3,
} as const;

// ============================================================================
// RUNTIME OVERHEAD CALCULATION
// ============================================================================

/**
 * Configuration for runtime overhead calculation
 */
export const RUNTIME_OVERHEAD_CONFIG = {
  /** Default trace count for overhead calculation */
  DEFAULT_OVERHEAD_TRACE_COUNT: 500000,
} as const;

// ============================================================================
// MODEL COMPLEXITY FACTORS
// ============================================================================

/**
 * Scaling factors for timing based on model complexity
 * Derived from state/transition counts in Table 1 of the paper
 */
export const MODEL_COMPLEXITY_FACTORS: Record<string, number> = {
  // Simple Models
  CM: 1.0, // 7 states, 12 transitions (baseline)
  PR: 2.5, // 25 states, 29 transitions
  RO: 4.0, // 32 states, 38 transitions
  FO: 6.0, // 49 states, 53 transitions
  // Instrumented Models
  RCM: 3.0, // 25 states, 28 transitions
  RPR: 7.0, // 68 states, 76 transitions
  RRO: 15.0, // 1,043 states, 1,087 transitions
  RFO: 30.0, // 2,364 states, 2,396 transitions
} as const;

// ============================================================================
// MREGTEST TRACE COUNTS (for Figures 4-6)
// ============================================================================

/**
 * Trace counts used for MRegTest evaluation
 * Range from 100K to 1M as specified in the paper
 */
export const MREGTEST_TRACE_COUNTS = [
  100000, 200000, 400000, 600000, 800000, 1000000,
] as const;

/**
 * Base trace count for MRegTest scaling calculations
 */
export const MREGTEST_BASE_TRACE_COUNT = 100000;

// ============================================================================
// MODEL LISTS
// ============================================================================

/**
 * List of simple model keys
 */
export const SIMPLE_MODEL_KEYS = ["CM", "PR", "RO", "FO"] as const;

/**
 * List of instrumented model keys
 */
export const INSTRUMENTED_MODEL_KEYS = ["RCM", "RPR", "RRO", "RFO"] as const;

/**
 * All model keys
 */
export const ALL_MODEL_KEYS = [
  ...SIMPLE_MODEL_KEYS,
  ...INSTRUMENTED_MODEL_KEYS,
] as const;

/**
 * All CRF types
 */
export const ALL_CRF_TYPES: CRFType[] = ["WM", "WP", "MM"];

/**
 * All execution modes
 */
export const ALL_EXECUTION_MODES: ExecutionMode[] = [
  "Single",
  "Sequential",
  "Nested",
];

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * MRegTest results type for figure data
 */
export interface MRegTestResultData {
  single: {
    tsMRegTest: number[];
    tsRATEN: number[];
    exMRegTest: number[];
    exRATEN: number[];
  };
  sequential: {
    tsMRegTest: number[];
    tsRATEN: number[];
    exMRegTest: number[];
    exRATEN: number[];
  };
  nested: {
    tsMRegTest: number[];
    tsRATEN: number[];
    exMRegTest: number[];
    exRATEN: number[];
  };
}
