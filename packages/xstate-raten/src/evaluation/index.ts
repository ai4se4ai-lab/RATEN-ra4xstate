/**
 * RATEN Evaluation Module
 *
 * Provides comprehensive datasets and evaluation scripts to reproduce
 * the experimental results from the RATEN research paper.
 *
 * All results are computed from actual RATEN analysis - no hardcoded expected values.
 */

// Constants and configuration
export * from "./constants";

// Mutant generators
export {
  generateWMmutant,
  generateWPmutant,
  generateMMmutant,
  generateMutant,
  generateCompoundMutant,
  batchGenerateMutants,
  calculateMutantMetrics,
} from "./mutant-generators";

export type {
  CRFType,
  MutantConfig,
  MutantResult,
  MutantMetrics,
} from "./mutant-generators";

// Trace generators
export {
  generateTraces,
  generateAllCaseStudyTraces,
  generateEvaluationTraces,
  MODEL_EVENTS,
} from "./trace-generators";

export type {
  ExecutionMode,
  TestingStrategy,
  TraceGeneratorConfig,
  TraceSet,
} from "./trace-generators";

// Basic evaluation (Table 2)
export {
  runSingleEvaluation,
  runBasicEvaluation,
  formatAsLatexTable2,
  formatAsJSON,
  formatAsCSV,
} from "./basic-evaluation";

export type { EvaluationResult, Table2Result } from "./basic-evaluation";

// Compound evaluation (Table 3)
export {
  runCompoundEvaluation,
  runFullCompoundEvaluation,
  formatAsLatexTable3,
  formatCompoundAsJSON,
  formatCompoundAsCSV,
  calculateRuntimeOverhead,
} from "./compound-evaluation";

export type {
  CompoundEvaluationResult,
  Table3Result,
  RuntimeOverheadAnalysis,
} from "./compound-evaluation";

// MRegTest evaluation (Figures 4-6)
export {
  generateMRegTestResults,
  calculateFigureSummary,
  runFullMRegTestEvaluation,
  formatFigureAsJSON,
  formatFigureAsCSV,
  generateLatexFigure,
  generateSummaryTable,
  getDetailedComparison,
} from "./mregtest-evaluation";

export type {
  MRegTestComparisonResult,
  FigureData,
  FigureSummary,
} from "./mregtest-evaluation";

// Main evaluation runner
export { runAllEvaluations, printResultsSummary } from "./run-evaluation";

export type { EvaluationOutput } from "./run-evaluation";
