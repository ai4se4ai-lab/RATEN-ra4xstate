/**
 * Mutant Generators for Common Robustness Failures (CRFs)
 *
 * Creates mutants by injecting:
 * - WM (Wrong Message): Unexpected message types
 * - WP (Wrong Payload): Malformed or invalid payload data
 * - MM (Missing Message): Missing expected messages/timeouts
 */
import type { Trace } from "../types";
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
 * Generate Wrong Message (WM) mutant
 * Replaces valid events with unexpected message types
 */
export declare function generateWMmutant(
  traces: Trace[],
  config?: Partial<MutantConfig>
): MutantResult;
/**
 * Generate Wrong Payload (WP) mutant
 * Keeps valid event types but corrupts payload data
 */
export declare function generateWPmutant(
  traces: Trace[],
  config?: Partial<MutantConfig>
): MutantResult;
/**
 * Generate Missing Message (MM) mutant
 * Removes expected messages to simulate timeout/missing scenarios
 */
export declare function generateMMmutant(
  traces: Trace[],
  config?: Partial<MutantConfig>
): MutantResult;
/**
 * Generate mutant based on CRF type
 */
export declare function generateMutant(
  traces: Trace[],
  crfType: CRFType,
  config?: Partial<MutantConfig>
): MutantResult;
/**
 * Generate compound mutant with multiple CRF types
 */
export declare function generateCompoundMutant(
  traces: Trace[],
  crfTypes: CRFType[],
  config?: Partial<MutantConfig>
): MutantResult;
/**
 * Batch generate mutants for a set of traces
 */
export declare function batchGenerateMutants(
  traces: Trace[],
  count: number,
  crfType: CRFType,
  config?: Partial<MutantConfig>
): MutantResult[];
/**
 * Calculate expected metrics for mutants
 */
export interface MutantMetrics {
  totalMutants: number;
  expectedViolations: number;
  averageInjectionPoints: number;
  crfDistribution: Record<CRFType, number>;
}
export declare function calculateMutantMetrics(
  mutants: MutantResult[]
): MutantMetrics;
//# sourceMappingURL=mutant-generators.d.ts.map
