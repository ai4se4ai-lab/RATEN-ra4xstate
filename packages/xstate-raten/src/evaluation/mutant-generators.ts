/**
 * Mutant Generators for Common Robustness Failures (CRFs)
 *
 * Creates mutants by injecting:
 * - WM (Wrong Message): Unexpected message types
 * - WP (Wrong Payload): Malformed or invalid payload data
 * - MM (Missing Message): Missing expected messages/timeouts
 */

import type { Trace } from "../types";
import { MUTATION_CONFIG } from "./constants";

/**
 * CRF Types
 */
export type CRFType = "WM" | "WP" | "MM";

/**
 * Mutant configuration
 */
export interface MutantConfig {
  /** Type of CRF to inject */
  crfType: CRFType;
  /** Probability of injection (0-1) */
  injectionRate: number;
  /** Specific positions to inject (if empty, random positions) */
  injectionPositions?: number[];
  /** Custom wrong messages for WM */
  wrongMessages?: string[];
  /** Custom wrong payloads for WP */
  wrongPayloads?: Record<string, any>[];
  /** Timeout duration for MM (ms) */
  missingMessageTimeout?: number;
}

/**
 * Mutant result
 */
export interface MutantResult {
  /** Original trace */
  originalTrace: Trace[];
  /** Mutated trace */
  mutatedTrace: Trace[];
  /** Injection points */
  injectionPoints: number[];
  /** CRF type applied */
  crfType: CRFType;
  /** Expected to trigger bad state */
  expectedBadState: boolean;
}

/**
 * Default wrong messages for WM mutations
 */
const DEFAULT_WRONG_MESSAGES = [
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
const DEFAULT_WRONG_PAYLOADS = [
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
export function generateWMmutant(
  traces: Trace[],
  config: Partial<MutantConfig> = {}
): MutantResult {
  const {
    injectionRate = MUTATION_CONFIG.DEFAULT_INJECTION_RATE,
    injectionPositions = [],
    wrongMessages = DEFAULT_WRONG_MESSAGES,
  } = config;

  const mutatedTrace = [...traces];
  const injectionPoints: number[] = [];

  // Determine injection positions
  const positions =
    injectionPositions.length > 0
      ? injectionPositions
      : generateRandomPositions(traces.length, injectionRate);

  positions.forEach((pos) => {
    if (pos >= 0 && pos < mutatedTrace.length) {
      const wrongMessage =
        wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
      mutatedTrace[pos] = {
        ...mutatedTrace[pos],
        event: wrongMessage,
        message: {
          ...mutatedTrace[pos].message,
          __mutated: true,
          __originalEvent: traces[pos].event,
          __mutationType: "WM",
        },
      };
      injectionPoints.push(pos);
    }
  });

  return {
    originalTrace: traces,
    mutatedTrace,
    injectionPoints,
    crfType: "WM",
    expectedBadState: injectionPoints.length > 0,
  };
}

/**
 * Generate Wrong Payload (WP) mutant
 * Keeps valid event types but corrupts payload data
 */
export function generateWPmutant(
  traces: Trace[],
  config: Partial<MutantConfig> = {}
): MutantResult {
  const {
    injectionRate = MUTATION_CONFIG.DEFAULT_INJECTION_RATE,
    injectionPositions = [],
    wrongPayloads = DEFAULT_WRONG_PAYLOADS,
  } = config;

  const mutatedTrace = [...traces];
  const injectionPoints: number[] = [];

  const positions =
    injectionPositions.length > 0
      ? injectionPositions
      : generateRandomPositions(traces.length, injectionRate);

  positions.forEach((pos) => {
    if (pos >= 0 && pos < mutatedTrace.length) {
      const wrongPayload =
        wrongPayloads[Math.floor(Math.random() * wrongPayloads.length)];
      mutatedTrace[pos] = {
        ...mutatedTrace[pos],
        message: {
          ...wrongPayload,
          __mutated: true,
          __originalPayload: traces[pos].message,
          __mutationType: "WP",
        },
      };
      injectionPoints.push(pos);
    }
  });

  return {
    originalTrace: traces,
    mutatedTrace,
    injectionPoints,
    crfType: "WP",
    expectedBadState: injectionPoints.length > 0,
  };
}

/**
 * Generate Missing Message (MM) mutant
 * Removes expected messages to simulate timeout/missing scenarios
 */
export function generateMMmutant(
  traces: Trace[],
  config: Partial<MutantConfig> = {}
): MutantResult {
  const {
    injectionRate = MUTATION_CONFIG.DEFAULT_INJECTION_RATE,
    injectionPositions = [],
    missingMessageTimeout = MUTATION_CONFIG.DEFAULT_MM_TIMEOUT_MS,
  } = config;

  const mutatedTrace: Trace[] = [];
  const injectionPoints: number[] = [];

  const positions =
    injectionPositions.length > 0
      ? injectionPositions
      : generateRandomPositions(traces.length, injectionRate);

  traces.forEach((trace, index) => {
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
    mutatedTrace,
    injectionPoints,
    crfType: "MM",
    expectedBadState: injectionPoints.length > 0,
  };
}

/**
 * Generate random positions for injection
 */
function generateRandomPositions(length: number, rate: number): number[] {
  const positions: number[] = [];
  for (let i = 0; i < length; i++) {
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
export function generateMutant(
  traces: Trace[],
  crfType: CRFType,
  config: Partial<MutantConfig> = {}
): MutantResult {
  switch (crfType) {
    case "WM":
      return generateWMmutant(traces, config);
    case "WP":
      return generateWPmutant(traces, config);
    case "MM":
      return generateMMmutant(traces, config);
    default:
      throw new Error(`Unknown CRF type: ${crfType}`);
  }
}

/**
 * Generate compound mutant with multiple CRF types
 */
export function generateCompoundMutant(
  traces: Trace[],
  crfTypes: CRFType[],
  config: Partial<MutantConfig> = {}
): MutantResult {
  let currentTraces = [...traces];
  const allInjectionPoints: number[] = [];
  const baseInjectionRate =
    config.injectionRate || MUTATION_CONFIG.DEFAULT_INJECTION_RATE;

  crfTypes.forEach((crfType) => {
    const result = generateMutant(currentTraces, crfType, {
      ...config,
      injectionRate: baseInjectionRate / crfTypes.length,
    });
    currentTraces = result.mutatedTrace;
    allInjectionPoints.push(...result.injectionPoints);
  });

  return {
    originalTrace: traces,
    mutatedTrace: currentTraces,
    injectionPoints: [...new Set(allInjectionPoints)].sort((a, b) => a - b),
    crfType: "WM", // Primary type (compound)
    expectedBadState: allInjectionPoints.length > 0,
  };
}

/**
 * Batch generate mutants for a set of traces
 */
export function batchGenerateMutants(
  traces: Trace[],
  count: number,
  crfType: CRFType,
  config: Partial<MutantConfig> = {}
): MutantResult[] {
  const results: MutantResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(generateMutant(traces, crfType, config));
  }
  return results;
}

/**
 * Calculate expected metrics for mutants
 */
export interface MutantMetrics {
  totalMutants: number;
  expectedViolations: number;
  averageInjectionPoints: number;
  crfDistribution: Record<CRFType, number>;
}

export function calculateMutantMetrics(mutants: MutantResult[]): MutantMetrics {
  const crfDistribution: Record<CRFType, number> = { WM: 0, WP: 0, MM: 0 };
  let totalInjectionPoints = 0;
  let expectedViolations = 0;

  mutants.forEach((mutant) => {
    crfDistribution[mutant.crfType]++;
    totalInjectionPoints += mutant.injectionPoints.length;
    if (mutant.expectedBadState) {
      expectedViolations++;
    }
  });

  return {
    totalMutants: mutants.length,
    expectedViolations,
    averageInjectionPoints: totalInjectionPoints / mutants.length,
    crfDistribution,
  };
}
