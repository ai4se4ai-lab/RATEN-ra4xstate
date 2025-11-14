/**
 * Algorithm 1: Property Model Preprocessing
 * Classifies transitions into L1, L2, L3, L4 categories
 */

import type { StateMachine, StateValue } from 'xstate';
import type { TransitionRules, RCStep } from './types';
import { extractRC } from './rcSteps';
import { isGoodState, isBadState } from './utils';

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
export function preProcessPSM(
  PSM: StateMachine<any, any, any>,
  goodStateTags: string[] = ['Good'],
  badStateTags: string[] = ['Bad']
): TransitionRules {
  const L1: RCStep[] = [];
  const L2: RCStep[] = [];
  const L3: RCStep[] = [];
  const L4: RCStep[] = [];
  
  // Extract all RC-steps from the PSM
  const transitions = extractRC(PSM);
  
  // Classify each transition
  for (const t of transitions) {
    const sourceIsGood = isGoodState(t.source, PSM, goodStateTags);
    const sourceIsBad = isBadState(t.source, PSM, badStateTags);
    const targetIsGood = isGoodState(t.target, PSM, goodStateTags);
    const targetIsBad = isBadState(t.target, PSM, badStateTags);
    
    if (sourceIsGood && targetIsGood) {
      // L1: Good → Good
      L1.push(t);
    } else if (sourceIsGood && targetIsBad) {
      // L2: Good → Bad (robustness violation)
      L2.push(t);
    } else if (sourceIsBad && targetIsGood) {
      // L3: Bad → Good (recovery)
      L3.push(t);
    } else if (sourceIsBad && targetIsBad) {
      // L4: Bad → Bad (continued degradation)
      L4.push(t);
    } else {
      // If state classification is ambiguous, default to L1
      // (assume good behavior if we can't determine)
      L1.push(t);
    }
  }
  
  return { L1, L2, L3, L4 };
}

