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
export declare const MODEL_EVENTS: Record<
  string,
  {
    normal: string[];
    recovery: string[];
  }
>;
/**
 * Main trace generator function
 */
export declare function generateTraces(
  config: Partial<TraceGeneratorConfig> & {
    modelKey?: string;
  }
): TraceSet;
/**
 * Generate traces for all case studies
 */
export declare function generateAllCaseStudyTraces(
  traceCount?: number,
  mode?: ExecutionMode,
  strategy?: TestingStrategy,
  crfTypes?: CRFType[]
): Record<string, TraceSet>;
/**
 * Generate large trace set for evaluation (100,000 traces)
 */
export declare function generateEvaluationTraces(
  modelKey: string,
  mode: ExecutionMode,
  strategy: TestingStrategy,
  crfType: CRFType
): TraceSet;
//# sourceMappingURL=trace-generators.d.ts.map
