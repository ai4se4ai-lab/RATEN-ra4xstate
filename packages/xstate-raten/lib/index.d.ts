/**
 * @xstate/raten - RATEN (Robustness Analysis Through Execution Norms) extension for XState
 *
 * This package provides cost-based robustness evaluation for XState machines,
 * including property model integration, trace replay, and test suite optimization.
 */
export { RATEN } from './raten';
export type { RATENConfig, RobustnessResult, TransitionRules, RCStep, Configuration, Trace, MessageQueue, RobustnessViolation } from './types';
export { QueryPSM, queryPSM } from './testEnhancement';
export { preProcessPSM } from './preprocessing';
export { extractRC } from './rcSteps';
export { computeCost } from './costComputation';
export { computeBTCost } from './btCost';
//# sourceMappingURL=index.d.ts.map