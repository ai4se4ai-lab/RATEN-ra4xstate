/**
 * Main Evaluation Runner
 *
 * Runs all evaluations and generates output in multiple formats.
 * All results are computed from actual RATEN analysis.
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

import { ALL_CRF_TYPES, TRACE_GENERATION_CONFIG } from "./constants";

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
  statistics: {
    table2Stats: {
      avgPrecision: number;
      avgRecall: number;
      minPrecision: number;
      maxPrecision: number;
      minRecall: number;
      maxRecall: number;
    };
    table3Stats: {
      avgOverhead: number;
      minOverhead: number;
      maxOverhead: number;
    };
    figureStats: {
      avgSizeReduction: number;
      avgTimeChange: number;
    };
  };
}

/**
 * Calculate statistics for Table 2 results
 */
function calculateTable2Stats(
  results: any[]
): EvaluationOutput["statistics"]["table2Stats"] {
  const precisions: number[] = [];
  const recalls: number[] = [];

  results.forEach((r) => {
    precisions.push(
      r.single.precision,
      r.sequential.precision,
      r.nested.precision
    );
    recalls.push(r.single.recall, r.sequential.recall, r.nested.recall);
  });

  return {
    avgPrecision:
      Math.round(
        (precisions.reduce((a, b) => a + b, 0) / precisions.length) * 100
      ) / 100,
    avgRecall:
      Math.round((recalls.reduce((a, b) => a + b, 0) / recalls.length) * 100) /
      100,
    minPrecision: Math.round(Math.min(...precisions) * 100) / 100,
    maxPrecision: Math.round(Math.max(...precisions) * 100) / 100,
    minRecall: Math.round(Math.min(...recalls) * 100) / 100,
    maxRecall: Math.round(Math.max(...recalls) * 100) / 100,
  };
}

/**
 * Calculate statistics for Table 3 results
 */
function calculateTable3Stats(
  results: any[]
): EvaluationOutput["statistics"]["table3Stats"] {
  const overheads = results.map((r) => r.avgRuntimeOverhead);

  return {
    avgOverhead:
      Math.round(
        (overheads.reduce((a, b) => a + b, 0) / overheads.length) * 100
      ) / 100,
    minOverhead: Math.round(Math.min(...overheads) * 100) / 100,
    maxOverhead: Math.round(Math.max(...overheads) * 100) / 100,
  };
}

/**
 * Calculate statistics for figure results
 */
function calculateFigureStats(
  summaries: any
): EvaluationOutput["statistics"]["figureStats"] {
  const sizeReductions: number[] = [];
  const timeChanges: number[] = [];

  Object.values(summaries).forEach((summary: any) => {
    sizeReductions.push(
      summary.singleSizeReduction,
      summary.sequentialSizeReduction,
      summary.nestedSizeReduction
    );
    timeChanges.push(
      summary.singleTimeChange,
      summary.sequentialTimeChange,
      summary.nestedTimeChange
    );
  });

  return {
    avgSizeReduction: Math.round(
      sizeReductions.reduce((a, b) => a + b, 0) / sizeReductions.length
    ),
    avgTimeChange: Math.round(
      timeChanges.reduce((a, b) => a + b, 0) / timeChanges.length
    ),
  };
}

/**
 * Run all evaluations
 */
export function runAllEvaluations(
  traceCount: number = 100 // Default to smaller count for faster execution
): EvaluationOutput {
  console.log("Starting RATEN Evaluation...");
  console.log("==============================\n");
  console.log(`Using ${traceCount} traces per configuration\n`);

  // Run Basic evaluation (Table 2)
  console.log("Running Basic Strategy Evaluation (Table 2)...");
  const table2Results = runBasicEvaluation(traceCount);
  console.log(`  Generated ${table2Results.length} result entries\n`);

  // Run Compound evaluation (Table 3)
  console.log("Running Compound Strategy Evaluation (Table 3)...");
  const table3Results = runFullCompoundEvaluation(traceCount);
  console.log(`  Generated ${table3Results.length} result entries\n`);

  // Run MRegTest evaluation (Figures 4-6)
  console.log("Running MRegTest Integration Evaluation (Figures 4-6)...");
  const figureResults = runFullMRegTestEvaluation();
  console.log(`  Generated figure data for ${ALL_CRF_TYPES.join(", ")}\n`);

  // Calculate statistics
  console.log("Calculating statistics...");
  const table2Stats = calculateTable2Stats(table2Results);
  const table3Stats = calculateTable3Stats(table3Results);
  const figureStats = calculateFigureStats(figureResults.summaries);

  console.log("\n==============================");
  console.log("EVALUATION COMPLETE");
  console.log("==============================\n");

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
    statistics: {
      table2Stats,
      table3Stats,
      figureStats,
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
  console.log(
    `  Average Precision: ${output.statistics.table2Stats.avgPrecision}`
  );
  console.log(`  Average Recall: ${output.statistics.table2Stats.avgRecall}`);
  console.log(
    `  Precision Range: ${output.statistics.table2Stats.minPrecision} - ${output.statistics.table2Stats.maxPrecision}`
  );
  console.log(
    `  Recall Range: ${output.statistics.table2Stats.minRecall} - ${output.statistics.table2Stats.maxRecall}`
  );

  // Table 3 summary
  console.log("\nTable 3 (Compound Strategy):");
  console.log("----------------------------");
  console.log(
    `  Average Runtime Overhead: ${output.statistics.table3Stats.avgOverhead}x`
  );
  console.log(`  Min Overhead: ${output.statistics.table3Stats.minOverhead}x`);
  console.log(`  Max Overhead: ${output.statistics.table3Stats.maxOverhead}x`);

  // Figures summary
  console.log("\nMRegTest Integration (Figures 4-6):");
  console.log("------------------------------------");
  console.log(
    `  Average Size Reduction: ${output.statistics.figureStats.avgSizeReduction}%`
  );
  console.log(
    `  Average Time Change: ${
      output.statistics.figureStats.avgTimeChange > 0 ? "+" : ""
    }${output.statistics.figureStats.avgTimeChange}%`
  );
  console.log("\n" + output.figures.summary);
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
