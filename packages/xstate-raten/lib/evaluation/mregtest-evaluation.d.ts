/**
 * MRegTest Integration Evaluation (Figures 4-6)
 *
 * Evaluates test suite reduction by integrating RATEN with MRegTest.
 * Produces data for:
 * - Figure 4: WM (Wrong Message) results
 * - Figure 5: WP (Wrong Payload) results
 * - Figure 6: MM (Missing Message) results
 */
import type { CRFType } from "./mutant-generators";
import type { ExecutionMode } from "./trace-generators";
/**
 * MRegTest comparison result
 */
export interface MRegTestComparisonResult {
  traceCount: number;
  crfType: CRFType;
  mode: ExecutionMode;
  tsMRegTest: number;
  tsRATEN: number;
  exMRegTest: number;
  exRATEN: number;
  sizeReduction: number;
  timeImprovement: number;
}
/**
 * Figure data structure for plotting
 */
export interface FigureData {
  crfType: CRFType;
  traceCounts: number[];
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
/**
 * Generate MRegTest comparison results for a specific CRF type
 */
export declare function generateMRegTestResults(crfType: CRFType): FigureData;
/**
 * Calculate summary statistics for a figure
 */
export interface FigureSummary {
  crfType: CRFType;
  singleSizeReduction: number;
  sequentialSizeReduction: number;
  nestedSizeReduction: number;
  singleTimeChange: number;
  sequentialTimeChange: number;
  nestedTimeChange: number;
}
export declare function calculateFigureSummary(data: FigureData): FigureSummary;
/**
 * Run full MRegTest evaluation for all CRF types
 */
export declare function runFullMRegTestEvaluation(): {
  figures: Record<CRFType, FigureData>;
  summaries: Record<CRFType, FigureSummary>;
};
/**
 * Format figure data as JSON
 */
export declare function formatFigureAsJSON(data: FigureData): string;
/**
 * Format figure data as CSV for plotting
 */
export declare function formatFigureAsCSV(
  data: FigureData,
  mode: ExecutionMode
): string;
/**
 * Generate LaTeX figure code
 */
export declare function generateLatexFigure(
  crfType: CRFType,
  figureNumber: number
): string;
/**
 * Generate summary table
 */
export declare function generateSummaryTable(
  summaries: Record<CRFType, FigureSummary>
): string;
/**
 * Generate detailed comparison results for a single trace count
 */
export declare function getDetailedComparison(
  crfType: CRFType,
  traceCount: number,
  mode: ExecutionMode
): MRegTestComparisonResult;
//# sourceMappingURL=mregtest-evaluation.d.ts.map
