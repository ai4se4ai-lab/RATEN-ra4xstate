/**
 * @xstate/raten - RATEN (Robustness Analysis Through Execution Norms) extension for XState
 *
 * This package provides cost-based robustness evaluation for XState machines,
 * including property model integration, trace replay, and test suite optimization.
 */

export { RATEN } from "./raten";
export type {
  RATENConfig,
  RequiredRATENConfig,
  RobustnessResult,
  TransitionRules,
  RCStep,
  Configuration,
  Trace,
  MessageQueue,
  RobustnessViolation,
} from "./types";

// Export utility functions
export { QueryPSM, queryPSM } from "./testEnhancement";
export { preProcessPSM } from "./preprocessing";
export { extractRC } from "./rcSteps";
export { computeCost } from "./costComputation";
export { computeBTCost } from "./btCost";

// Export case studies
export * from "./case-studies";

// Export evaluation module
export * from "./evaluation";
