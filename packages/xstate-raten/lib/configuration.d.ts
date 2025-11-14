/**
 * Configuration Management
 * Represents γ (gamma) state - current machine configuration
 */
import type { StateMachine, StateValue } from 'xstate';
import type { Configuration, RCStep } from './types';
/**
 * Create initial configuration (γ_0)
 */
export declare function createInitialConfiguration(machine: StateMachine<any, any, any>): Configuration;
/**
 * Replay an RC-step to update configuration
 * Updates the configuration state after executing an RC-step
 *
 * @param rc_step The RC-step to replay
 * @param gamma Current configuration
 * @returns Updated configuration
 */
export declare function replay(rc_step: RCStep, gamma: Configuration): Configuration;
/**
 * Create a configuration from a state machine's current state
 */
export declare function createConfigurationFromState(machine: StateMachine<any, any, any>, stateValue: StateValue, context?: any): Configuration;
//# sourceMappingURL=configuration.d.ts.map