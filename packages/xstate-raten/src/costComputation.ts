/**
 * Algorithm 2: Cost Computation
 * Calculates total robustness cost by processing execution traces
 */

import type { StateMachine } from 'xstate';
import type { Trace, RCStep, Configuration, TransitionRules, RobustnessResult, RobustnessViolation } from './types';
import { extractRC } from './rcSteps';
import { createInitialConfiguration, replay } from './configuration';
import { getRCStepBSM, getRCStepPSM, initializeMessageQueue, removeMatchingTrace } from './traceReplay';
import { computeBTCost } from './btCost';
import { getCost } from './costExtraction';
import { isMatched } from './utils';

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
export function computeCost(
  RC_B: RCStep[],
  RC_P: RCStep[],
  Rules: TransitionRules,
  traces: Trace[],
  BSM: StateMachine<any, any, any>,
  PSM: StateMachine<any, any, any>,
  usrMAX: number,
  depthMAX: number
): RobustnessResult {
  // Initialize configurations
  let gamma_B = createInitialConfiguration(BSM);
  let gamma_P = createInitialConfiguration(PSM);
  
  // Initialize costs
  let OTcost = 0;
  let BTcost = 0;
  let TTcost = 0;
  
  // Initialize message queue with startUp
  const M = initializeMessageQueue();
  
  // Unpack rules
  const { L1, L2, L3, L4 } = Rules;
  
  // Copy traces array to avoid mutating original
  const inTraces = [...traces];
  
  const violations: RobustnessViolation[] = [];
  let traceIndex = 0;
  
  // Process traces until consumed
  while (inTraces.length > 0) {
    // Get next trace
    const trace = inTraces[0];
    const msg = M.dequeue();
    
    // Get RC-steps for BSM and PSM
    const { rc_step: rc_b, gamma: gamma_1 } = getRCStepBSM(trace, msg, RC_B, gamma_B);
    const { rc_step: rc_p, gamma: gamma_2 } = getRCStepPSM(
      gamma_1.eventData || { type: trace.event },
      msg,
      RC_P,
      gamma_P
    );
    
    // Check if we have valid RC-steps
    if (!rc_b || !rc_p) {
      // No matching transition, skip this trace
      removeMatchingTrace(inTraces, trace);
      traceIndex++;
      continue;
    }
    
    // Determine transition classification and compute costs
    const sourceState = gamma_P.state;
    const targetState = gamma_2.state;
    
    if (isMatched(L2, sourceState, targetState)) {
      // From a Good state to a Bad state: calculate OTcost and BTcost
      OTcost = getCost(gamma_P, rc_b);
      BTcost = computeBTCost(
        RC_B,
        RC_P,
        rc_b,
        rc_p,
        gamma_1,
        gamma_2,
        PSM,
        usrMAX,
        depthMAX
      );
    } else if (isMatched(L3, sourceState, targetState)) {
      // From a Bad state to a Good state: recovery step
      OTcost = 0;
      BTcost = getCost(gamma_P, rc_b);
    } else if (isMatched(L4, sourceState, targetState)) {
      // From a Bad state to a Bad state: accumulate OTcost
      OTcost = OTcost + getCost(gamma_P, rc_b);
      BTcost = computeBTCost(
        RC_B,
        RC_P,
        rc_b,
        rc_p,
        gamma_1,
        gamma_2,
        PSM,
        usrMAX,
        depthMAX
      );
    } else {
      // L1: From a Good state to a Good state: no cost
      OTcost = 0;
      BTcost = 0;
    }
    
    // Compute total cost
    TTcost = OTcost + BTcost;
    
    // Check if cost exceeds threshold
    if (TTcost > usrMAX) {
      // Record violation
      violations.push({
        traceIndex,
        state: targetState,
        event: trace.event,
        cost: TTcost,
      });
      
      // Return NotRobust result
      return {
        TTcost,
        OTcost,
        BTcost,
        isRobust: false,
        violations,
      };
    }
    
    // Update configurations
    gamma_B = replay(rc_b, gamma_1);
    gamma_P = replay(rc_p, gamma_2);
    
    // Remove processed trace
    removeMatchingTrace(inTraces, trace);
    traceIndex++;
  }
  
  // All traces processed successfully
  return {
    TTcost,
    OTcost,
    BTcost,
    isRobust: true,
    violations,
  };
}

