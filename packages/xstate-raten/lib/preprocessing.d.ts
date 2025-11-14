/**
 * Algorithm 1: Property Model Preprocessing
 * Classifies transitions into L1, L2, L3, L4 categories
 */
import type { StateMachine } from 'xstate';
import type { TransitionRules } from './types';
/**
 * Preprocess Property State Machine (PSM)
 * Classifies all transitions into four categories:
 * - L1: Good → Good (maintaining good behavior, cost = 0)
 * - L2: Good → Bad (robustness violation, cost > 0)
 * - L3: Bad → Good (recovery, cost may be negative)
 * - L4: Bad → Bad (continued degradation, cost accumulates)
 *
 * @param PSM Property State Machine
 * @param goodStateTags Tags identifying good states (default: ['Good'])
 * @param badStateTags Tags identifying bad states (default: ['Bad'])
 * @returns Classified transition rules ⟨L1, L2, L3, L4⟩
 */
export declare function preProcessPSM(PSM: StateMachine<any, any, any>, goodStateTags?: string[], badStateTags?: string[]): TransitionRules;
//# sourceMappingURL=preprocessing.d.ts.map