"use strict";
/**
 * Main Evaluation Runner
 *
 * Runs all evaluations and generates output in multiple formats
 */
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.printResultsSummary = exports.runAllEvaluations = void 0;
var basic_evaluation_1 = require("./basic-evaluation");
var compound_evaluation_1 = require("./compound-evaluation");
var mregtest_evaluation_1 = require("./mregtest-evaluation");
/**
 * Validate results against expected values
 */
function validateTable2Results(results) {
  var match = true;
  var tolerance = 0.15; // 15% tolerance
  results.forEach(function (result) {
    var _a;
    var expected =
      (_a = basic_evaluation_1.EXPECTED_RESULTS_TABLE2[result.model]) ===
        null || _a === void 0
        ? void 0
        : _a[result.crfType];
    if (expected) {
      var modes = ["single", "sequential", "nested"];
      modes.forEach(function (mode) {
        var exp = expected[mode.charAt(0).toUpperCase() + mode.slice(1)];
        var actual = result[mode];
        if (Math.abs(actual.btCost - exp.btCost) / exp.btCost > tolerance) {
          match = false;
        }
        if (Math.abs(actual.precision - exp.precision) > 0.05) {
          match = false;
        }
        if (Math.abs(actual.recall - exp.recall) > 0.05) {
          match = false;
        }
      });
    }
  });
  return match;
}
function validateTable3Results(results) {
  var match = true;
  var tolerance = 0.15;
  results.forEach(function (result) {
    var expected = compound_evaluation_1.EXPECTED_RESULTS_TABLE3[result.model];
    if (expected) {
      if (
        Math.abs(result.sequential.btCost - expected.sequential.btCost) /
          expected.sequential.btCost >
        tolerance
      ) {
        match = false;
      }
      if (
        Math.abs(result.nested.btCost - expected.nested.btCost) /
          expected.nested.btCost >
        tolerance
      ) {
        match = false;
      }
    }
  });
  return match;
}
function validateFigureResults(figures) {
  // Validate size reductions are within expected ranges
  var expectedWM = { single: 17, sequential: 62, nested: 59 };
  var expectedWP = { single: 19, sequential: 37, nested: 78 };
  var expectedMM = { single: 43, sequential: 54, nested: 77 };
  var tolerance = 5; // 5% points tolerance
  var wmSummary = figures.summaries.WM;
  var wpSummary = figures.summaries.WP;
  var mmSummary = figures.summaries.MM;
  var checkReduction = function (actual, expected) {
    return Math.abs(actual - expected) <= tolerance;
  };
  return (
    checkReduction(wmSummary.singleSizeReduction, expectedWM.single) &&
    checkReduction(wmSummary.sequentialSizeReduction, expectedWM.sequential) &&
    checkReduction(wmSummary.nestedSizeReduction, expectedWM.nested) &&
    checkReduction(wpSummary.singleSizeReduction, expectedWP.single) &&
    checkReduction(wpSummary.sequentialSizeReduction, expectedWP.sequential) &&
    checkReduction(wpSummary.nestedSizeReduction, expectedWP.nested) &&
    checkReduction(mmSummary.singleSizeReduction, expectedMM.single) &&
    checkReduction(mmSummary.sequentialSizeReduction, expectedMM.sequential) &&
    checkReduction(mmSummary.nestedSizeReduction, expectedMM.nested)
  );
}
/**
 * Run all evaluations
 */
function runAllEvaluations(traceCount) {
  if (traceCount === void 0) {
    traceCount = 1000;
  }
  console.log("Starting RATEN Evaluation...");
  console.log("==============================\n");
  // Run Basic evaluation (Table 2)
  console.log("Running Basic Strategy Evaluation (Table 2)...");
  var table2Results = (0, basic_evaluation_1.runBasicEvaluation)(traceCount);
  console.log("  Generated ".concat(table2Results.length, " result entries"));
  // Run Compound evaluation (Table 3)
  console.log("Running Compound Strategy Evaluation (Table 3)...");
  var table3Results = (0, compound_evaluation_1.runFullCompoundEvaluation)(
    traceCount
  );
  console.log("  Generated ".concat(table3Results.length, " result entries"));
  // Run MRegTest evaluation (Figures 4-6)
  console.log("Running MRegTest Integration Evaluation (Figures 4-6)...");
  var figureResults = (0, mregtest_evaluation_1.runFullMRegTestEvaluation)();
  console.log("  Generated figure data for WM, WP, MM");
  // Validate results
  console.log("\nValidating Results...");
  var table2Match = validateTable2Results(table2Results);
  var table3Match = validateTable3Results(table3Results);
  var figuresMatch = validateFigureResults(figureResults);
  console.log("  Table 2 validation: ".concat(table2Match ? "PASS" : "FAIL"));
  console.log("  Table 3 validation: ".concat(table3Match ? "PASS" : "FAIL"));
  console.log("  Figures validation: ".concat(figuresMatch ? "PASS" : "FAIL"));
  var overallMatch = table2Match && table3Match && figuresMatch;
  console.log(
    "\n  Overall validation: ".concat(overallMatch ? "PASS" : "FAIL")
  );
  return {
    table2: {
      results: table2Results,
      latex: (0, basic_evaluation_1.formatAsLatexTable2)(table2Results),
      json: (0, basic_evaluation_1.formatAsJSON)(table2Results),
      csv: (0, basic_evaluation_1.formatAsCSV)(table2Results),
    },
    table3: {
      results: table3Results,
      latex: (0, compound_evaluation_1.formatAsLatexTable3)(table3Results),
      json: (0, compound_evaluation_1.formatCompoundAsJSON)(table3Results),
      csv: (0, compound_evaluation_1.formatCompoundAsCSV)(table3Results),
    },
    figures: {
      wmData: figureResults.figures.WM,
      wpData: figureResults.figures.WP,
      mmData: figureResults.figures.MM,
      summary: (0, mregtest_evaluation_1.generateSummaryTable)(
        figureResults.summaries
      ),
    },
    validation: {
      table2Match: table2Match,
      table3Match: table3Match,
      figuresMatch: figuresMatch,
      overallMatch: overallMatch,
    },
  };
}
exports.runAllEvaluations = runAllEvaluations;
/**
 * Print summary of results
 */
function printResultsSummary(output) {
  console.log("\n==============================");
  console.log("EVALUATION RESULTS SUMMARY");
  console.log("==============================\n");
  // Table 2 summary
  console.log("Table 2 (Basic Strategy):");
  console.log("-------------------------");
  var simpleCount = output.table2.results.filter(function (r) {
    return r.level === "Simple";
  }).length;
  var instrCount = output.table2.results.filter(function (r) {
    return r.level === "Instrumented";
  }).length;
  console.log(
    "  Simple models: ".concat(simpleCount / 3, " models \u00D7 3 CRF types")
  );
  console.log(
    "  Instrumented models: ".concat(
      instrCount / 3,
      " models \u00D7 3 CRF types"
    )
  );
  // Calculate average metrics
  var avgPrecision =
    output.table2.results.reduce(function (sum, r) {
      return (
        sum + r.single.precision + r.sequential.precision + r.nested.precision
      );
    }, 0) /
    (output.table2.results.length * 3);
  var avgRecall =
    output.table2.results.reduce(function (sum, r) {
      return sum + r.single.recall + r.sequential.recall + r.nested.recall;
    }, 0) /
    (output.table2.results.length * 3);
  console.log("  Average Precision: ".concat(avgPrecision.toFixed(2)));
  console.log("  Average Recall: ".concat(avgRecall.toFixed(2)));
  // Table 3 summary
  console.log("\nTable 3 (Compound Strategy):");
  console.log("----------------------------");
  var avgOverhead =
    output.table3.results.reduce(function (sum, r) {
      return sum + r.avgRuntimeOverhead;
    }, 0) / output.table3.results.length;
  console.log(
    "  Average Runtime Overhead: ".concat(avgOverhead.toFixed(2), "x")
  );
  console.log(
    "  Min Overhead: ".concat(
      Math.min
        .apply(
          Math,
          __spreadArray(
            [],
            __read(
              output.table3.results.map(function (r) {
                return r.avgRuntimeOverhead;
              })
            ),
            false
          )
        )
        .toFixed(2),
      "x"
    )
  );
  console.log(
    "  Max Overhead: ".concat(
      Math.max
        .apply(
          Math,
          __spreadArray(
            [],
            __read(
              output.table3.results.map(function (r) {
                return r.avgRuntimeOverhead;
              })
            ),
            false
          )
        )
        .toFixed(2),
      "x"
    )
  );
  // Figures summary
  console.log("\nMRegTest Integration (Figures 4-6):");
  console.log("------------------------------------");
  console.log(output.figures.summary);
  // Validation summary
  console.log("\nValidation Status:");
  console.log("------------------");
  console.log(
    "  Table 2: ".concat(output.validation.table2Match ? "✓ PASS" : "✗ FAIL")
  );
  console.log(
    "  Table 3: ".concat(output.validation.table3Match ? "✓ PASS" : "✗ FAIL")
  );
  console.log(
    "  Figures: ".concat(output.validation.figuresMatch ? "✓ PASS" : "✗ FAIL")
  );
  console.log(
    "  Overall: ".concat(
      output.validation.overallMatch
        ? "✓ ALL TESTS PASSED"
        : "✗ SOME TESTS FAILED"
    )
  );
}
exports.printResultsSummary = printResultsSummary;
// Main execution when run directly
if (typeof require !== "undefined" && require.main === module) {
  var output = runAllEvaluations(1000);
  printResultsSummary(output);
  // Output JSON for further analysis
  console.log("\n\nGenerating output files...");
  console.log("Table 2 JSON preview (first entry):");
  console.log(JSON.stringify(output.table2.results[0], null, 2));
  console.log("\nTable 3 JSON preview (first entry):");
  console.log(JSON.stringify(output.table3.results[0], null, 2));
}
