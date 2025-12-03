/**
 * Main Evaluation Runner
 *
 * Runs all evaluations and generates output in multiple formats
 */

import {
  runBasicEvaluation,
  formatAsLatexTable2,
  formatAsJSON,
  formatAsCSV,
} from "./basic-evaluation";

import {
  runFullCompoundEvaluation,
  formatAsLatexTable3,
  formatCompoundAsJSON,
  formatCompoundAsCSV,
} from "./compound-evaluation";

import {
  runFullMRegTestEvaluation,
  generateSummaryTable,
} from "./mregtest-evaluation";

import {
  EXPECTED_RESULTS_TABLE2,
  EXPECTED_RESULTS_TABLE3,
  EXPECTED_SIZE_REDUCTIONS,
  VALIDATION_TOLERANCES,
  ALL_CRF_TYPES,
  TRACE_GENERATION_CONFIG,
} from "./constants";

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
 * Validate results against expected values
 */
function validateTable2Results(results: any[]): boolean {
  let match = true;

  results.forEach((result) => {
    const expected = EXPECTED_RESULTS_TABLE2[result.model]?.[result.crfType];
    if (expected) {
      const modes = ["single", "sequential", "nested"] as const;
      modes.forEach((mode) => {
        const exp =
          expected[
            (mode.charAt(0).toUpperCase() +
              mode.slice(1)) as keyof typeof expected
          ];
        const actual = result[mode];

        if (
          Math.abs(actual.btCost - (exp as any).btCost) / (exp as any).btCost >
          VALIDATION_TOLERANCES.TIMING_TOLERANCE
        ) {
          match = false;
        }
        if (
          Math.abs(actual.precision - (exp as any).precision) >
          VALIDATION_TOLERANCES.PRECISION_RECALL_TOLERANCE
        ) {
          match = false;
        }
        if (
          Math.abs(actual.recall - (exp as any).recall) >
          VALIDATION_TOLERANCES.PRECISION_RECALL_TOLERANCE
        ) {
          match = false;
        }
      });
    }
  });

  return match;
}

function validateTable3Results(results: any[]): boolean {
  let match = true;

  results.forEach((result) => {
    const expected = EXPECTED_RESULTS_TABLE3[result.model];
    if (expected) {
      if (
        Math.abs(result.sequential.btCost - expected.sequential.btCost) /
          expected.sequential.btCost >
        VALIDATION_TOLERANCES.TIMING_TOLERANCE
      ) {
        match = false;
      }
      if (
        Math.abs(result.nested.btCost - expected.nested.btCost) /
          expected.nested.btCost >
        VALIDATION_TOLERANCES.TIMING_TOLERANCE
      ) {
        match = false;
      }
    }
  });

  return match;
}

function validateFigureResults(figures: any): boolean {
  // Validate size reductions are within expected ranges
  const checkReduction = (actual: number, expected: number) =>
    Math.abs(actual - expected) <=
    VALIDATION_TOLERANCES.FIGURE_REDUCTION_TOLERANCE;

  const wmSummary = figures.summaries.WM;
  const wpSummary = figures.summaries.WP;
  const mmSummary = figures.summaries.MM;

  return (
    checkReduction(
      wmSummary.singleSizeReduction,
      EXPECTED_SIZE_REDUCTIONS.WM.single
    ) &&
    checkReduction(
      wmSummary.sequentialSizeReduction,
      EXPECTED_SIZE_REDUCTIONS.WM.sequential
    ) &&
    checkReduction(
      wmSummary.nestedSizeReduction,
      EXPECTED_SIZE_REDUCTIONS.WM.nested
    ) &&
    checkReduction(
      wpSummary.singleSizeReduction,
      EXPECTED_SIZE_REDUCTIONS.WP.single
    ) &&
    checkReduction(
      wpSummary.sequentialSizeReduction,
      EXPECTED_SIZE_REDUCTIONS.WP.sequential
    ) &&
    checkReduction(
      wpSummary.nestedSizeReduction,
      EXPECTED_SIZE_REDUCTIONS.WP.nested
    ) &&
    checkReduction(
      mmSummary.singleSizeReduction,
      EXPECTED_SIZE_REDUCTIONS.MM.single
    ) &&
    checkReduction(
      mmSummary.sequentialSizeReduction,
      EXPECTED_SIZE_REDUCTIONS.MM.sequential
    ) &&
    checkReduction(
      mmSummary.nestedSizeReduction,
      EXPECTED_SIZE_REDUCTIONS.MM.nested
    )
  );
}

/**
 * Run all evaluations
 */
export function runAllEvaluations(
  traceCount: number = TRACE_GENERATION_CONFIG.DEFAULT_TRACE_COUNT
): EvaluationOutput {
  console.log("Starting RATEN Evaluation...");
  console.log("==============================\n");

  // Run Basic evaluation (Table 2)
  console.log("Running Basic Strategy Evaluation (Table 2)...");
  const table2Results = runBasicEvaluation(traceCount);
  console.log(`  Generated ${table2Results.length} result entries`);

  // Run Compound evaluation (Table 3)
  console.log("Running Compound Strategy Evaluation (Table 3)...");
  const table3Results = runFullCompoundEvaluation(traceCount);
  console.log(`  Generated ${table3Results.length} result entries`);

  // Run MRegTest evaluation (Figures 4-6)
  console.log("Running MRegTest Integration Evaluation (Figures 4-6)...");
  const figureResults = runFullMRegTestEvaluation();
  console.log(`  Generated figure data for ${ALL_CRF_TYPES.join(", ")}`);

  // Validate results
  console.log("\nValidating Results...");
  const table2Match = validateTable2Results(table2Results);
  const table3Match = validateTable3Results(table3Results);
  const figuresMatch = validateFigureResults(figureResults);

  console.log(`  Table 2 validation: ${table2Match ? "PASS" : "FAIL"}`);
  console.log(`  Table 3 validation: ${table3Match ? "PASS" : "FAIL"}`);
  console.log(`  Figures validation: ${figuresMatch ? "PASS" : "FAIL"}`);

  const overallMatch = table2Match && table3Match && figuresMatch;
  console.log(`\n  Overall validation: ${overallMatch ? "PASS" : "FAIL"}`);

  return {
    table2: {
      results: table2Results,
      latex: formatAsLatexTable2(table2Results),
      json: formatAsJSON(table2Results),
      csv: formatAsCSV(table2Results),
    },
    table3: {
      results: table3Results,
      latex: formatAsLatexTable3(table3Results),
      json: formatCompoundAsJSON(table3Results),
      csv: formatCompoundAsCSV(table3Results),
    },
    figures: {
      wmData: figureResults.figures.WM,
      wpData: figureResults.figures.WP,
      mmData: figureResults.figures.MM,
      summary: generateSummaryTable(figureResults.summaries),
    },
    validation: {
      table2Match,
      table3Match,
      figuresMatch,
      overallMatch,
    },
  };
}

/**
 * Print summary of results
 */
export function printResultsSummary(output: EvaluationOutput): void {
  console.log("\n==============================");
  console.log("EVALUATION RESULTS SUMMARY");
  console.log("==============================\n");

  // Table 2 summary
  console.log("Table 2 (Basic Strategy):");
  console.log("-------------------------");
  const simpleCount = output.table2.results.filter(
    (r) => r.level === "Simple"
  ).length;
  const instrCount = output.table2.results.filter(
    (r) => r.level === "Instrumented"
  ).length;
  const crfTypeCount = ALL_CRF_TYPES.length;
  console.log(
    `  Simple models: ${
      simpleCount / crfTypeCount
    } models × ${crfTypeCount} CRF types`
  );
  console.log(
    `  Instrumented models: ${
      instrCount / crfTypeCount
    } models × ${crfTypeCount} CRF types`
  );

  // Calculate average metrics
  const avgPrecision =
    output.table2.results.reduce(
      (sum, r) =>
        sum + r.single.precision + r.sequential.precision + r.nested.precision,
      0
    ) /
    (output.table2.results.length * 3);
  const avgRecall =
    output.table2.results.reduce(
      (sum, r) => sum + r.single.recall + r.sequential.recall + r.nested.recall,
      0
    ) /
    (output.table2.results.length * 3);

  console.log(`  Average Precision: ${avgPrecision.toFixed(2)}`);
  console.log(`  Average Recall: ${avgRecall.toFixed(2)}`);

  // Table 3 summary
  console.log("\nTable 3 (Compound Strategy):");
  console.log("----------------------------");
  const avgOverhead =
    output.table3.results.reduce((sum, r) => sum + r.avgRuntimeOverhead, 0) /
    output.table3.results.length;
  console.log(`  Average Runtime Overhead: ${avgOverhead.toFixed(2)}x`);
  console.log(
    `  Min Overhead: ${Math.min(
      ...output.table3.results.map((r) => r.avgRuntimeOverhead)
    ).toFixed(2)}x`
  );
  console.log(
    `  Max Overhead: ${Math.max(
      ...output.table3.results.map((r) => r.avgRuntimeOverhead)
    ).toFixed(2)}x`
  );

  // Figures summary
  console.log("\nMRegTest Integration (Figures 4-6):");
  console.log("------------------------------------");
  console.log(output.figures.summary);

  // Validation summary
  console.log("\nValidation Status:");
  console.log("------------------");
  console.log(
    `  Table 2: ${output.validation.table2Match ? "✓ PASS" : "✗ FAIL"}`
  );
  console.log(
    `  Table 3: ${output.validation.table3Match ? "✓ PASS" : "✗ FAIL"}`
  );
  console.log(
    `  Figures: ${output.validation.figuresMatch ? "✓ PASS" : "✗ FAIL"}`
  );
  console.log(
    `  Overall: ${
      output.validation.overallMatch
        ? "✓ ALL TESTS PASSED"
        : "✗ SOME TESTS FAILED"
    }`
  );
}

// Main execution when run directly
if (typeof require !== "undefined" && require.main === module) {
  const output = runAllEvaluations(TRACE_GENERATION_CONFIG.DEFAULT_TRACE_COUNT);
  printResultsSummary(output);

  // Output JSON for further analysis
  console.log("\n\nGenerating output files...");
  console.log("Table 2 JSON preview (first entry):");
  console.log(JSON.stringify(output.table2.results[0], null, 2));

  console.log("\nTable 3 JSON preview (first entry):");
  console.log(JSON.stringify(output.table3.results[0], null, 2));
}
