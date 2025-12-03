/**
 * Basic Strategy Evaluation (Table 2 Results)
 *
 * Evaluates RATEN performance with single CRF type injections
 * across Single, Sequential, and Nested execution modes.
 */
import type { CRFType } from "./mutant-generators";
import type { ExecutionMode } from "./trace-generators";
/**
 * Evaluation result for a single configuration
 */
export interface EvaluationResult {
  modelKey: string;
  modelName: string;
  crfType: CRFType;
  mode: ExecutionMode;
  btCostTime: number;
  attTime: number;
  precision: number;
  recall: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  totalTraces: number;
}
/**
 * Table 2 format result
 */
export interface Table2Result {
  level: "Simple" | "Instrumented";
  crfType: CRFType;
  model: string;
  single: {
    btCost: number;
    att: number;
    precision: number;
    recall: number;
  };
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
}
/**
 * Expected results from the paper (Table 2)
 * These are the target values our evaluation should approximate
 */
export declare const EXPECTED_RESULTS_TABLE2: Record<
  string,
  Record<
    CRFType,
    Record<
      ExecutionMode,
      {
        btCost: number;
        att: number;
        precision: number;
        recall: number;
      }
    >
  >
>;
/**
 * Run evaluation for a single configuration
 */
export declare function runSingleEvaluation(
  modelKey: string,
  crfType: CRFType,
  mode: ExecutionMode,
  traceCount?: number
): EvaluationResult;
/**
 * Run full Basic strategy evaluation (produces Table 2)
 */
export declare function runBasicEvaluation(traceCount?: number): Table2Result[];
/**
 * Format results as LaTeX table (Table 2 format)
 */
export declare function formatAsLatexTable2(results: Table2Result[]): string;
/**
 * Format results as JSON for analysis
 */
export declare function formatAsJSON(results: Table2Result[]): string;
/**
 * Format results as CSV
 */
export declare function formatAsCSV(results: Table2Result[]): string;
//# sourceMappingURL=basic-evaluation.d.ts.map
