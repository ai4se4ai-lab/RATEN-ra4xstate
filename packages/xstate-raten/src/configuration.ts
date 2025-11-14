/**
 * Configuration Management
 * Represents γ (gamma) state - current machine configuration
 */

import type { StateMachine, StateValue, EventObject } from 'xstate';
import type { Configuration, RCStep } from './types';

/**
 * Create initial configuration (γ_0)
 */
export function createInitialConfiguration(
  machine: StateMachine<any, any, any>
): Configuration {
  return {
    state: machine.initialState.value,
    context: machine.context || {},
    machine,
  };
}

/**
 * Replay an RC-step to update configuration
 * Updates the configuration state after executing an RC-step
 * 
 * @param rc_step The RC-step to replay
 * @param gamma Current configuration
 * @returns Updated configuration
 */
export function replay(rc_step: RCStep, gamma: Configuration): Configuration {
  // Update state to target of the transition
  const newState = rc_step.target;
  
  // Update context if there's event data
  let newContext = { ...gamma.context };
  if (rc_step.actions && rc_step.actions.length > 0) {
    // Apply any context updates from actions
    // This is a simplified version - in practice, actions might modify context
    for (const action of rc_step.actions) {
      if (action && typeof action === 'object' && 'assign' in action) {
        // Handle assign actions
        if (typeof action.assign === 'function') {
          newContext = action.assign(newContext, { type: rc_step.event });
        } else if (typeof action.assign === 'object') {
          newContext = { ...newContext, ...action.assign };
        }
      }
    }
  }
  
  return {
    state: newState,
    context: newContext,
    eventData: { type: rc_step.event },
    machine: gamma.machine,
  };
}

/**
 * Create a configuration from a state machine's current state
 */
export function createConfigurationFromState(
  machine: StateMachine<any, any, any>,
  stateValue: StateValue,
  context?: any
): Configuration {
  return {
    state: stateValue,
    context: context || machine.context || {},
    machine,
  };
}

