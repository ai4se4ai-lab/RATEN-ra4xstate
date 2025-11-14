/**
 * Trace Collection & Replay
 * Handles trace collection, message queue, and trace replay functionality
 */

import type { StateMachine, EventObject } from 'xstate';
import type { Trace, MessageQueue, Configuration, RCStep } from './types';
import { extractRC } from './rcSteps';
import { replay } from './configuration';

/**
 * Simple message queue implementation
 */
export class SimpleMessageQueue implements MessageQueue {
  private messages: any[] = [];
  
  append(message: any): void {
    this.messages.push(message);
  }
  
  dequeue(): any | undefined {
    return this.messages.shift();
  }
  
  isEmpty(): boolean {
    return this.messages.length === 0;
  }
  
  length(): number {
    return this.messages.length;
  }
  
  clear(): void {
    this.messages = [];
  }
}

/**
 * Get RC-step for BSM based on trace and message
 * 
 * @param trace Current trace entry
 * @param msg Message from queue
 * @param RC_B RC-steps of BSM
 * @param gamma_B Current BSM configuration
 * @returns RC-step and updated configuration
 */
export function getRCStepBSM(
  trace: Trace,
  msg: any,
  RC_B: RCStep[],
  gamma_B: Configuration
): { rc_step: RCStep | null; gamma: Configuration } {
  // Find matching RC-step for the event
  const matchingStep = RC_B.find(step => 
    step.event === trace.event && 
    compareStateValue(step.source, gamma_B.state)
  );
  
  if (!matchingStep) {
    // No matching transition found
    return { rc_step: null, gamma: gamma_B };
  }
  
  // Replay the step to get updated configuration
  const updatedGamma = replay(matchingStep, gamma_B);
  
  return { rc_step: matchingStep, gamma: updatedGamma };
}

/**
 * Get RC-step for PSM based on event data and message
 * 
 * @param eventData Event data from BSM (γ_1.E)
 * @param msg Message from queue
 * @param RC_P RC-steps of PSM
 * @param gamma_P Current PSM configuration
 * @returns RC-step and updated configuration
 */
export function getRCStepPSM(
  eventData: any,
  msg: any,
  RC_P: RCStep[],
  gamma_P: Configuration
): { rc_step: RCStep | null; gamma: Configuration } {
  // Extract event type from eventData
  const eventType = eventData?.type || msg?.type || '';
  
  // Find matching RC-step for the event
  const matchingStep = RC_P.find(step => 
    step.event === eventType && 
    compareStateValue(step.source, gamma_P.state)
  );
  
  if (!matchingStep) {
    // No matching transition found
    return { rc_step: null, gamma: gamma_P };
  }
  
  // Replay the step to get updated configuration
  const updatedGamma = replay(matchingStep, gamma_P);
  
  return { rc_step: matchingStep, gamma: updatedGamma };
}

/**
 * Compare state values for equality
 */
function compareStateValue(state1: any, state2: any): boolean {
  if (typeof state1 === 'string' && typeof state2 === 'string') {
    return state1 === state2;
  }
  return JSON.stringify(state1) === JSON.stringify(state2);
}

/**
 * Remove matching trace from traces array
 */
export function removeMatchingTrace(traces: Trace[], trace: Trace): void {
  const index = traces.findIndex(t => 
    t.event === trace.event && 
    JSON.stringify(t.message) === JSON.stringify(trace.message)
  );
  
  if (index !== -1) {
    traces.splice(index, 1);
  }
}

/**
 * Initialize message queue with startUp message
 */
export function initializeMessageQueue(): MessageQueue {
  const queue = new SimpleMessageQueue();
  queue.append({ type: 'startUp' });
  return queue;
}

