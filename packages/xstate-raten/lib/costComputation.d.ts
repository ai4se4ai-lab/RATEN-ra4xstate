/**
 * Algorithm 2: Cost Computation
 * Calculates total robustness cost by processing execution traces
 */
import type { StateMachine } from 'xstate';
import type { Trace, RCStep, TransitionRules, RobustnessResult } from './types';
/**
 * Compute total robustness cost
 * Implements Algorithm 2 from the paper
 *
 * @param RC_B RC-steps of BSM
 * @param RC_P RC-steps of PSM
 * @param Rules Classified transition rules (L1, L2, L3, L4)
 * @param traces Execution traces to process
 * @param BSM Behavioral State Machine
 * @param PSM Property State Machine
 * @param usrMAX Maximum acceptable total cost
 * @param depthMAX Maximum depth for BT cost search
 * @returns RobustnessResult with costs and violations
 */
export declare function computeCost(RC_B: RCStep[], RC_P: RCStep[], Rules: TransitionRules, traces: Trace[], BSM: StateMachine<any, any, any>, PSM: StateMachine<any, any, any>, usrMAX: number, depthMAX: number): RobustnessResult;
//# sourceMappingURL=costComputation.d.ts.map