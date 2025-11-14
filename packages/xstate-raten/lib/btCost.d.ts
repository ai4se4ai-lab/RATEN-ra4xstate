/**
 * Algorithm 3: Back-Track Cost Computation
 * Calculates the cost required for the system to recover from a bad state to a good state
 */
import type { StateMachine } from 'xstate';
import type { RCStep, Configuration } from './types';
/**
 * Compute Back-Track cost
 * Finds minimum-cost recovery path from bad state to good state
 *
 * @param RC_B RC-steps of BSM
 * @param RC_P RC-steps of PSM
 * @param rc_b Current BSM RC-step
 * @param rc_p Current PSM RC-step
 * @param gamma_1 BSM configuration
 * @param gamma_2 PSM configuration (current bad state)
 * @param PSM Property State Machine
 * @param usrMAX Maximum acceptable cost
 * @param depthMAX Maximum search depth
 * @returns BTcost (Back-Track cost) or UINT_MAX if no path found
 */
export declare function computeBTCost(RC_B: RCStep[], RC_P: RCStep[], rc_b: RCStep | null, rc_p: RCStep | null, gamma_1: Configuration, gamma_2: Configuration, PSM: StateMachine<any, any, any>, usrMAX: number, depthMAX: number): number;
//# sourceMappingURL=btCost.d.ts.map