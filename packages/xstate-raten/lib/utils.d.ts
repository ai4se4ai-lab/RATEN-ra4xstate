/**
 * Utility functions for RATEN
 */
import type { StateMachine, StateValue, StateNode } from 'xstate';
import type { RCStep } from './types';
/**
 * Check if a state is classified as Good
 */
export declare function isGoodState(state: StateValue, machine: StateMachine<any, any, any>, goodStateTags?: string[]): boolean;
/**
 * Check if a state is classified as Bad
 */
export declare function isBadState(state: StateValue, machine: StateMachine<any, any, any>, badStateTags?: string[]): boolean;
/**
 * Get StateNode from machine by state value
 */
export declare function getStateNode(machine: StateMachine<any, any, any>, stateValue: StateValue): StateNode<any, any, any> | null;
/**
 * Resolve state path from state value
 */
export declare function resolveStatePath(stateValue: StateValue): string;
/**
 * Check if a transition matches a rule set
 */
export declare function isMatched(rules: RCStep[], sourceState: StateValue, targetState: StateValue): boolean;
/**
 * Compare two state values for equality
 */
export declare function compareStates(state1: StateValue, state2: StateValue): boolean;
/**
 * Get all Good states from a machine
 */
export declare function getGoodStates(machine: StateMachine<any, any, any>, goodStateTags?: string[]): StateValue[];
/**
 * Get all Bad states from a machine
 */
export declare function getBadStates(machine: StateMachine<any, any, any>, badStateTags?: string[]): StateValue[];
//# sourceMappingURL=utils.d.ts.map