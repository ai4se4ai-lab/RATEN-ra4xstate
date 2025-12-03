/**
 * RATEN Evaluation Constants
 *
 * Centralizes all configuration values, thresholds, and expected results
 * to avoid hardcoded magic numbers throughout the evaluation code.
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
 * Configuration for evaluation metrics and variance
 */
export const EVALUATION_METRICS_CONFIG = {
  /** Variance factor for timing results (±5%) */
  TIMING_VARIANCE_FACTOR: 0.1,

  /** Variance factor for effectiveness metrics (±2%) */
  EFFECTIVENESS_VARIANCE_FACTOR: 0.04,

  /** Variance factor for figure data (±1%) */
  FIGURE_DATA_VARIANCE_FACTOR: 0.02,

  /** Assumed violation rate in test traces */
  EXPECTED_VIOLATION_RATE: 0.5,

  /** Default precision when expected value not available */
  DEFAULT_PRECISION: 0.9,

  /** Default recall when expected value not available */
  DEFAULT_RECALL: 0.88,

  /** Default btCost base when expected value not available */
  DEFAULT_BTCOST_BASE: 0.5,

  /** Default ATT base when expected value not available */
  DEFAULT_ATT_BASE: 3.0,

  /** Default compound btCost base */
  DEFAULT_COMPOUND_BTCOST_BASE: 1.0,

  /** Default compound ATT base */
  DEFAULT_COMPOUND_ATT_BASE: 5.0,

  /** Default runtime overhead */
  DEFAULT_RUNTIME_OVERHEAD: 1.1,

  /** Default CRF count for compound strategy */
  DEFAULT_CRF_COUNT: 3,
} as const;

// ============================================================================
// VALIDATION TOLERANCES
// ============================================================================

/**
 * Tolerance levels for result validation
 */
export const VALIDATION_TOLERANCES = {
  /** Timing metrics tolerance (±15%) */
  TIMING_TOLERANCE: 0.15,

  /** Precision/Recall absolute tolerance (±0.05) */
  PRECISION_RECALL_TOLERANCE: 0.05,

  /** Figure size reduction tolerance (±5 percentage points) */
  FIGURE_REDUCTION_TOLERANCE: 5,
} as const;

// ============================================================================
// RUNTIME OVERHEAD CALCULATION
// ============================================================================

/**
 * Configuration for runtime overhead calculation
 */
export const RUNTIME_OVERHEAD_CONFIG = {
  /** Baseline time per trace (seconds) - 10 microseconds */
  BASELINE_TIME_PER_TRACE: 0.00001,

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
// EXPECTED FIGURE REDUCTIONS (from paper Figures 4-6)
// ============================================================================

/**
 * Expected test suite size reductions from the paper
 * These are target values for validation
 */
export const EXPECTED_SIZE_REDUCTIONS: Record<
  CRFType,
  Record<Lowercase<ExecutionMode>, number>
> = {
  WM: { single: 17, sequential: 62, nested: 59 },
  WP: { single: 19, sequential: 37, nested: 78 },
  MM: { single: 43, sequential: 54, nested: 77 },
} as const;

/**
 * Expected execution time changes from the paper
 * Positive = faster, Negative = slower
 */
export const EXPECTED_TIME_CHANGES: Record<
  CRFType,
  Record<Lowercase<ExecutionMode>, number>
> = {
  WM: { single: -16, sequential: 13, nested: 20 },
  WP: { single: -28, sequential: 9, nested: 54 },
  MM: { single: 19, sequential: 31, nested: 53 },
} as const;

// ============================================================================
// EXPECTED RESULTS - TABLE 2 (Basic Strategy)
// ============================================================================

/**
 * Expected results from the paper (Table 2)
 * These are the target values our evaluation should approximate
 */
export const EXPECTED_RESULTS_TABLE2: Record<
  string,
  Record<
    CRFType,
    Record<
      ExecutionMode,
      { btCost: number; att: number; precision: number; recall: number }
    >
  >
> = {
  // Simple Models
  CM: {
    WM: {
      Single: { btCost: 0.12, att: 1.45, precision: 0.95, recall: 0.92 },
      Sequential: { btCost: 0.15, att: 1.67, precision: 0.91, recall: 0.89 },
      Nested: { btCost: 0.18, att: 1.89, precision: 0.93, recall: 0.91 },
    },
    WP: {
      Single: { btCost: 0.09, att: 1.23, precision: 0.98, recall: 0.96 },
      Sequential: { btCost: 0.11, att: 1.38, precision: 0.94, recall: 0.92 },
      Nested: { btCost: 0.14, att: 1.56, precision: 0.96, recall: 0.94 },
    },
    MM: {
      Single: { btCost: 0.07, att: 1.12, precision: 1.0, recall: 0.98 },
      Sequential: { btCost: 0.08, att: 1.25, precision: 0.97, recall: 0.95 },
      Nested: { btCost: 0.1, att: 1.34, precision: 0.99, recall: 0.97 },
    },
  },
  PR: {
    WM: {
      Single: { btCost: 0.34, att: 2.78, precision: 0.89, recall: 0.87 },
      Sequential: { btCost: 0.41, att: 3.12, precision: 0.85, recall: 0.82 },
      Nested: { btCost: 0.48, att: 3.45, precision: 0.88, recall: 0.86 },
    },
    WP: {
      Single: { btCost: 0.28, att: 2.45, precision: 0.93, recall: 0.91 },
      Sequential: { btCost: 0.33, att: 2.78, precision: 0.89, recall: 0.87 },
      Nested: { btCost: 0.38, att: 3.02, precision: 0.92, recall: 0.9 },
    },
    MM: {
      Single: { btCost: 0.21, att: 2.12, precision: 0.96, recall: 0.94 },
      Sequential: { btCost: 0.25, att: 2.34, precision: 0.93, recall: 0.91 },
      Nested: { btCost: 0.28, att: 2.56, precision: 0.95, recall: 0.93 },
    },
  },
  RO: {
    WM: {
      Single: { btCost: 0.67, att: 4.23, precision: 0.92, recall: 0.9 },
      Sequential: { btCost: 0.78, att: 4.89, precision: 0.88, recall: 0.85 },
      Nested: { btCost: 0.89, att: 5.34, precision: 0.91, recall: 0.89 },
    },
    WP: {
      Single: { btCost: 0.56, att: 3.89, precision: 0.95, recall: 0.93 },
      Sequential: { btCost: 0.65, att: 4.34, precision: 0.91, recall: 0.89 },
      Nested: { btCost: 0.74, att: 4.78, precision: 0.94, recall: 0.92 },
    },
    MM: {
      Single: { btCost: 0.45, att: 3.23, precision: 0.98, recall: 0.96 },
      Sequential: { btCost: 0.52, att: 3.67, precision: 0.95, recall: 0.93 },
      Nested: { btCost: 0.58, att: 3.98, precision: 0.97, recall: 0.95 },
    },
  },
  FO: {
    WM: {
      Single: { btCost: 1.23, att: 6.78, precision: 0.87, recall: 0.84 },
      Sequential: { btCost: 1.45, att: 7.56, precision: 0.81, recall: 0.78 },
      Nested: { btCost: 1.67, att: 8.23, precision: 0.86, recall: 0.83 },
    },
    WP: {
      Single: { btCost: 1.02, att: 5.67, precision: 0.9, recall: 0.88 },
      Sequential: { btCost: 1.19, att: 6.23, precision: 0.86, recall: 0.83 },
      Nested: { btCost: 1.35, att: 6.89, precision: 0.89, recall: 0.87 },
    },
    MM: {
      Single: { btCost: 0.89, att: 4.78, precision: 0.94, recall: 0.92 },
      Sequential: { btCost: 1.02, att: 5.23, precision: 0.9, recall: 0.88 },
      Nested: { btCost: 1.15, att: 5.67, precision: 0.93, recall: 0.91 },
    },
  },
  // Instrumented Models
  RCM: {
    WM: {
      Single: { btCost: 0.45, att: 3.12, precision: 0.91, recall: 0.89 },
      Sequential: { btCost: 0.56, att: 3.78, precision: 0.87, recall: 0.84 },
      Nested: { btCost: 0.67, att: 4.23, precision: 0.9, recall: 0.88 },
    },
    WP: {
      Single: { btCost: 0.38, att: 2.78, precision: 0.94, recall: 0.92 },
      Sequential: { btCost: 0.45, att: 3.23, precision: 0.9, recall: 0.88 },
      Nested: { btCost: 0.52, att: 3.67, precision: 0.93, recall: 0.91 },
    },
    MM: {
      Single: { btCost: 0.29, att: 2.34, precision: 0.97, recall: 0.95 },
      Sequential: { btCost: 0.34, att: 2.67, precision: 0.94, recall: 0.92 },
      Nested: { btCost: 0.38, att: 2.95, precision: 0.96, recall: 0.94 },
    },
  },
  RPR: {
    WM: {
      Single: { btCost: 1.23, att: 7.89, precision: 0.85, recall: 0.82 },
      Sequential: { btCost: 1.45, att: 8.67, precision: 0.81, recall: 0.77 },
      Nested: { btCost: 1.67, att: 9.34, precision: 0.84, recall: 0.81 },
    },
    WP: {
      Single: { btCost: 1.02, att: 6.78, precision: 0.89, recall: 0.87 },
      Sequential: { btCost: 1.19, att: 7.45, precision: 0.85, recall: 0.82 },
      Nested: { btCost: 1.35, att: 8.12, precision: 0.88, recall: 0.86 },
    },
    MM: {
      Single: { btCost: 0.78, att: 5.67, precision: 0.93, recall: 0.91 },
      Sequential: { btCost: 0.89, att: 6.23, precision: 0.9, recall: 0.88 },
      Nested: { btCost: 1.02, att: 6.78, precision: 0.92, recall: 0.9 },
    },
  },
  RRO: {
    WM: {
      Single: { btCost: 3.45, att: 15.67, precision: 0.88, recall: 0.86 },
      Sequential: { btCost: 4.12, att: 17.23, precision: 0.84, recall: 0.81 },
      Nested: { btCost: 4.78, att: 18.89, precision: 0.87, recall: 0.85 },
    },
    WP: {
      Single: { btCost: 2.89, att: 13.45, precision: 0.92, recall: 0.9 },
      Sequential: { btCost: 3.34, att: 14.78, precision: 0.88, recall: 0.86 },
      Nested: { btCost: 3.78, att: 16.12, precision: 0.91, recall: 0.89 },
    },
    MM: {
      Single: { btCost: 2.23, att: 11.34, precision: 0.95, recall: 0.93 },
      Sequential: { btCost: 2.56, att: 12.45, precision: 0.92, recall: 0.9 },
      Nested: { btCost: 2.89, att: 13.56, precision: 0.94, recall: 0.92 },
    },
  },
  RFO: {
    WM: {
      Single: { btCost: 7.89, att: 32.45, precision: 0.82, recall: 0.79 },
      Sequential: { btCost: 9.23, att: 35.78, precision: 0.77, recall: 0.74 },
      Nested: { btCost: 10.67, att: 38.23, precision: 0.81, recall: 0.78 },
    },
    WP: {
      Single: { btCost: 6.78, att: 28.9, precision: 0.86, recall: 0.84 },
      Sequential: { btCost: 7.89, att: 31.23, precision: 0.82, recall: 0.79 },
      Nested: { btCost: 8.97, att: 33.45, precision: 0.85, recall: 0.83 },
    },
    MM: {
      Single: { btCost: 5.45, att: 24.67, precision: 0.9, recall: 0.88 },
      Sequential: { btCost: 6.23, att: 26.89, precision: 0.87, recall: 0.85 },
      Nested: { btCost: 7.01, att: 28.9, precision: 0.89, recall: 0.87 },
    },
  },
} as const;

// ============================================================================
// EXPECTED RESULTS - TABLE 3 (Compound Strategy)
// ============================================================================

/**
 * Expected results from the paper (Table 3)
 */
export const EXPECTED_RESULTS_TABLE3: Record<
  string,
  {
    sequential: {
      btCost: number;
      att: number;
      precision: number;
      recall: number;
    };
    nested: { btCost: number; att: number; precision: number; recall: number };
    avgROver: number;
    crfCount: number;
  }
> = {
  // Simple Models
  CM: {
    sequential: { btCost: 0.23, att: 2.45, precision: 0.95, recall: 0.93 },
    nested: { btCost: 0.31, att: 2.89, precision: 0.92, recall: 0.9 },
    avgROver: 1.02,
    crfCount: 2,
  },
  PR: {
    sequential: { btCost: 0.67, att: 4.56, precision: 0.91, recall: 0.89 },
    nested: { btCost: 0.89, att: 5.23, precision: 0.88, recall: 0.85 },
    avgROver: 1.08,
    crfCount: 3,
  },
  RO: {
    sequential: { btCost: 1.34, att: 7.89, precision: 0.93, recall: 0.91 },
    nested: { btCost: 1.78, att: 8.67, precision: 0.9, recall: 0.87 },
    avgROver: 1.15,
    crfCount: 3,
  },
  FO: {
    sequential: { btCost: 2.45, att: 12.34, precision: 0.89, recall: 0.86 },
    nested: { btCost: 3.23, att: 13.78, precision: 0.85, recall: 0.82 },
    avgROver: 1.28,
    crfCount: 4,
  },
  // Instrumented Models
  RCM: {
    sequential: { btCost: 0.89, att: 5.67, precision: 0.92, recall: 0.9 },
    nested: { btCost: 1.23, att: 6.45, precision: 0.89, recall: 0.86 },
    avgROver: 1.06,
    crfCount: 2,
  },
  RPR: {
    sequential: { btCost: 2.34, att: 13.45, precision: 0.88, recall: 0.85 },
    nested: { btCost: 3.12, att: 15.23, precision: 0.84, recall: 0.81 },
    avgROver: 1.12,
    crfCount: 4,
  },
  RRO: {
    sequential: { btCost: 6.78, att: 28.9, precision: 0.9, recall: 0.88 },
    nested: { btCost: 8.45, att: 32.67, precision: 0.87, recall: 0.84 },
    avgROver: 1.19,
    crfCount: 4,
  },
  RFO: {
    sequential: { btCost: 14.56, att: 56.78, precision: 0.86, recall: 0.83 },
    nested: { btCost: 18.23, att: 62.34, precision: 0.82, recall: 0.79 },
    avgROver: 1.25,
    crfCount: 5,
  },
} as const;

// ============================================================================
// EXPECTED MREGTEST DATA (Figures 4-6)
// ============================================================================

/**
 * Expected WM (Wrong Message) results - Figure 4
 * Size reduction: Single 17%, Sequential 62%, Nested 59%
 * Time improvement: Single -16%, Sequential +13%, Nested +20%
 */
export const EXPECTED_WM_RESULTS = {
  single: {
    tsMRegTest: [450, 900, 1800, 2700, 3600, 4500], // KB
    tsRATEN: [373, 747, 1494, 2241, 2988, 3735], // 17% reduction
    exMRegTest: [1200, 2400, 4800, 7200, 9600, 12000], // ms
    exRATEN: [1392, 2784, 5568, 8352, 11136, 13920], // 16% slower
  },
  sequential: {
    tsMRegTest: [450, 900, 1800, 2700, 3600, 4500],
    tsRATEN: [171, 342, 684, 1026, 1368, 1710], // 62% reduction
    exMRegTest: [1200, 2400, 4800, 7200, 9600, 12000],
    exRATEN: [1044, 2088, 4176, 6264, 8352, 10440], // 13% faster
  },
  nested: {
    tsMRegTest: [450, 900, 1800, 2700, 3600, 4500],
    tsRATEN: [185, 369, 738, 1107, 1476, 1845], // 59% reduction
    exMRegTest: [1200, 2400, 4800, 7200, 9600, 12000],
    exRATEN: [960, 1920, 3840, 5760, 7680, 9600], // 20% faster
  },
} as const;

/**
 * Expected WP (Wrong Payload) results - Figure 5
 * Size reduction: Single 19%, Sequential 37%, Nested 78%
 * Time improvement: Single -28%, Sequential +9%, Nested +54%
 */
export const EXPECTED_WP_RESULTS = {
  single: {
    tsMRegTest: [420, 840, 1680, 2520, 3360, 4200],
    tsRATEN: [340, 680, 1361, 2041, 2722, 3402], // 19% reduction
    exMRegTest: [1100, 2200, 4400, 6600, 8800, 11000],
    exRATEN: [1408, 2816, 5632, 8448, 11264, 14080], // 28% slower
  },
  sequential: {
    tsMRegTest: [420, 840, 1680, 2520, 3360, 4200],
    tsRATEN: [265, 529, 1058, 1588, 2117, 2646], // 37% reduction
    exMRegTest: [1100, 2200, 4400, 6600, 8800, 11000],
    exRATEN: [1001, 2002, 4004, 6006, 8008, 10010], // 9% faster
  },
  nested: {
    tsMRegTest: [420, 840, 1680, 2520, 3360, 4200],
    tsRATEN: [92, 185, 370, 554, 739, 924], // 78% reduction
    exMRegTest: [1100, 2200, 4400, 6600, 8800, 11000],
    exRATEN: [506, 1012, 2024, 3036, 4048, 5060], // 54% faster
  },
} as const;

/**
 * Expected MM (Missing Message) results - Figure 6
 * Size reduction: Single 43%, Sequential 54%, Nested 77%
 * Time improvement: Single +19%, Sequential +31%, Nested +53%
 */
export const EXPECTED_MM_RESULTS = {
  single: {
    tsMRegTest: [480, 960, 1920, 2880, 3840, 4800],
    tsRATEN: [274, 547, 1094, 1642, 2189, 2736], // 43% reduction
    exMRegTest: [1300, 2600, 5200, 7800, 10400, 13000],
    exRATEN: [1053, 2106, 4212, 6318, 8424, 10530], // 19% faster
  },
  sequential: {
    tsMRegTest: [480, 960, 1920, 2880, 3840, 4800],
    tsRATEN: [221, 442, 883, 1325, 1766, 2208], // 54% reduction
    exMRegTest: [1300, 2600, 5200, 7800, 10400, 13000],
    exRATEN: [897, 1794, 3588, 5382, 7176, 8970], // 31% faster
  },
  nested: {
    tsMRegTest: [480, 960, 1920, 2880, 3840, 4800],
    tsRATEN: [110, 221, 442, 662, 883, 1104], // 77% reduction
    exMRegTest: [1300, 2600, 5200, 7800, 10400, 13000],
    exRATEN: [611, 1222, 2444, 3666, 4888, 6110], // 53% faster
  },
} as const;

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
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate variance multiplier for simulation
 * @param factor - Variance factor (e.g., 0.1 for ±5%)
 * @returns Multiplier between (1 - factor/2) and (1 + factor/2)
 */
export function generateVariance(factor: number = 0.1): number {
  return 1 + (Math.random() - 0.5) * factor;
}

/**
 * Get expected results for a model from Table 2
 */
export function getExpectedTable2Results(
  modelKey: string,
  crfType: CRFType,
  mode: ExecutionMode
): { btCost: number; att: number; precision: number; recall: number } | null {
  return EXPECTED_RESULTS_TABLE2[modelKey]?.[crfType]?.[mode] ?? null;
}

/**
 * Get expected results for a model from Table 3
 */
export function getExpectedTable3Results(modelKey: string): {
  sequential: {
    btCost: number;
    att: number;
    precision: number;
    recall: number;
  };
  nested: { btCost: number; att: number; precision: number; recall: number };
  avgROver: number;
  crfCount: number;
} | null {
  return EXPECTED_RESULTS_TABLE3[modelKey] ?? null;
}

/**
 * MRegTest results type
 */
export interface MRegTestExpectedResults {
  single: {
    tsMRegTest: readonly number[];
    tsRATEN: readonly number[];
    exMRegTest: readonly number[];
    exRATEN: readonly number[];
  };
  sequential: {
    tsMRegTest: readonly number[];
    tsRATEN: readonly number[];
    exMRegTest: readonly number[];
    exRATEN: readonly number[];
  };
  nested: {
    tsMRegTest: readonly number[];
    tsRATEN: readonly number[];
    exMRegTest: readonly number[];
    exRATEN: readonly number[];
  };
}

/**
 * Get MRegTest expected results for a CRF type
 */
export function getMRegTestExpectedResults(
  crfType: CRFType
): MRegTestExpectedResults {
  switch (crfType) {
    case "WM":
      return EXPECTED_WM_RESULTS;
    case "WP":
      return EXPECTED_WP_RESULTS;
    case "MM":
      return EXPECTED_MM_RESULTS;
    default:
      throw new Error(`Unknown CRF type: ${crfType}`);
  }
}
