/**
 * Compound Strategy Evaluation (Table 3 Results)
 *
 * Evaluates RATEN performance with multiple CRF types injected simultaneously
 * in Sequential and Nested execution modes, including runtime overhead analysis.
 */
import type { ExecutionMode } from "./trace-generators";
/**
 * Compound evaluation result
 */
export interface CompoundEvaluationResult {
  modelKey: string;
  modelName: string;
  mode: ExecutionMode;
  btCostTime: number;
  attTime: number;
  precision: number;
  recall: number;
  avgRuntimeOverhead: number;
  crfCount: number;
}
/**
 * Table 3 format result
 */
export interface Table3Result {
  level: "Simple" | "Instrumented";
  model: string;
  sequential: {
    btCost: number;
    att: number;
    precision: number;
    recall: number;
  };
  nested: {
    btCost: number;
    att: number;
    precision: number;
    recall: number;
  };
  avgRuntimeOverhead: number;
  crfCount: number;
}
/**
 * Expected results from the paper (Table 3)
 */
export declare const EXPECTED_RESULTS_TABLE3: Record<
  string,
  {
    sequential: {
      btCost: number;
      att: number;
      precision: number;
      recall: number;
    };
    nested: {
      btCost: number;
      att: number;
      precision: number;
      recall: number;
    };
    avgROver: number;
    crfCount: number;
  }
>;
/**
 * Run evaluation for a single compound configuration
 */
export declare function runCompoundEvaluation(
  modelKey: string,
  mode: ExecutionMode,
  traceCount?: number
): CompoundEvaluationResult;
/**
 * Run full Compound strategy evaluation (produces Table 3)
 */
export declare function runFullCompoundEvaluation(
  traceCount?: number
): Table3Result[];
/**
 * Format results as LaTeX table (Table 3 format)
 */
export declare function formatAsLatexTable3(results: Table3Result[]): string;
/**
 * Format results as JSON
 */
export declare function formatCompoundAsJSON(results: Table3Result[]): string;
/**
 * Format results as CSV
 */
export declare function formatCompoundAsCSV(results: Table3Result[]): string;
/**
 * Calculate runtime overhead comparison
 */
export interface RuntimeOverheadAnalysis {
  modelKey: string;
  baselineTime: number;
  ratenTime: number;
  overhead: number;
  traceCount: number;
}
export declare function calculateRuntimeOverhead(
  modelKey: string,
  traceCount?: number
): RuntimeOverheadAnalysis;
//# sourceMappingURL=compound-evaluation.d.ts.map
