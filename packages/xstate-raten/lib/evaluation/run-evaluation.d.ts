/**
 * Main Evaluation Runner
 *
 * Runs all evaluations and generates output in multiple formats
 */
/**
 * Evaluation output
 */
export interface EvaluationOutput {
  table2: {
    results: any[];
    latex: string;
    json: string;
    csv: string;
  };
  table3: {
    results: any[];
    latex: string;
    json: string;
    csv: string;
  };
  figures: {
    wmData: any;
    wpData: any;
    mmData: any;
    summary: string;
  };
  validation: {
    table2Match: boolean;
    table3Match: boolean;
    figuresMatch: boolean;
    overallMatch: boolean;
  };
}
/**
 * Run all evaluations
 */
export declare function runAllEvaluations(
  traceCount?: number
): EvaluationOutput;
/**
 * Print summary of results
 */
export declare function printResultsSummary(output: EvaluationOutput): void;
//# sourceMappingURL=run-evaluation.d.ts.map
