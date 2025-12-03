/**
 * RATEN Evaluation Module
 *
 * Exports all evaluation components for reproducing research paper results
 */

// Mutant generators
export * from "./mutant-generators";

// Trace generators
export * from "./trace-generators";

// Basic strategy evaluation (Table 2)
export * from "./basic-evaluation";

// Compound strategy evaluation (Table 3)
export * from "./compound-evaluation";

// MRegTest integration evaluation (Figures 4-6)
export * from "./mregtest-evaluation";

// Re-export for convenience
export {
  runBasicEvaluation,
  formatAsLatexTable2,
  formatAsJSON,
  formatAsCSV,
} from "./basic-evaluation";
export {
  runFullCompoundEvaluation,
  formatAsLatexTable3,
  formatCompoundAsJSON,
  formatCompoundAsCSV,
} from "./compound-evaluation";
export {
  runFullMRegTestEvaluation,
  generateSummaryTable,
} from "./mregtest-evaluation";
