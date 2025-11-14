/**
 * Utility functions for RATEN
 */

import type { StateMachine, StateValue, StateNode } from 'xstate';
import type { RCStep, TransitionRules } from './types';

/**
 * Check if a state is classified as Good
 */
export function isGoodState(
  state: StateValue,
  machine: StateMachine<any, any, any>,
  goodStateTags: string[] = ['Good']
): boolean {
  // First check if state name contains "Good" (simple fallback)
  const stateStr = typeof state === 'string' ? state : JSON.stringify(state);
  if (stateStr.toLowerCase().includes('good')) {
    return true;
  }
  
  // Try to get state node and check tags
  const stateNode = getStateNode(machine, state);
  if (stateNode) {
    // Check tags (StateNode.tags is an array, not a Set)
    for (const tag of goodStateTags) {
      if (stateNode.tags && stateNode.tags.includes(tag)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if a state is classified as Bad
 */
export function isBadState(
  state: StateValue,
  machine: StateMachine<any, any, any>,
  badStateTags: string[] = ['Bad']
): boolean {
  // First check if state name contains "Bad" (simple fallback)
  const stateStr = typeof state === 'string' ? state : JSON.stringify(state);
  if (stateStr.toLowerCase().includes('bad')) {
    return true;
  }
  
  // Try to get state node and check tags
  const stateNode = getStateNode(machine, state);
  if (stateNode) {
    // Check tags (StateNode.tags is an array, not a Set)
    for (const tag of badStateTags) {
      if (stateNode.tags && stateNode.tags.includes(tag)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get StateNode from machine by state value
 */
export function getStateNode(
  machine: StateMachine<any, any, any>,
  stateValue: StateValue
): StateNode<any, any, any> | null {
  try {
    if (typeof stateValue === 'string') {
      return (machine.getStateNodeById(stateValue) as any) || null;
    }
    
    // For nested states, resolve the path
    const statePath = resolveStatePath(stateValue);
    return (machine.getStateNodeById(statePath) as any) || null;
  } catch {
    return null;
  }
}

/**
 * Resolve state path from state value
 */
export function resolveStatePath(stateValue: StateValue): string {
  if (typeof stateValue === 'string') {
    return stateValue;
  }
  
  // For nested states, create a path
  const parts: string[] = [];
  function traverse(obj: any, prefix = '') {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        parts.push(prefix ? `${prefix}.${key}.${obj[key]}` : `${key}.${obj[key]}`);
      } else if (typeof obj[key] === 'object') {
        traverse(obj[key], prefix ? `${prefix}.${key}` : key);
      }
    }
  }
  traverse(stateValue);
  
  return parts[0] || '';
}

/**
 * Check if a transition matches a rule set
 */
export function isMatched(
  rules: RCStep[],
  sourceState: StateValue,
  targetState: StateValue
): boolean {
  return rules.some(rule => {
    const sourceMatch = compareStates(rule.source, sourceState);
    const targetMatch = compareStates(rule.target, targetState);
    return sourceMatch && targetMatch;
  });
}

/**
 * Compare two state values for equality
 */
export function compareStates(state1: StateValue, state2: StateValue): boolean {
  if (typeof state1 === 'string' && typeof state2 === 'string') {
    return state1 === state2;
  }
  
  return JSON.stringify(state1) === JSON.stringify(state2);
}

/**
 * Get all Good states from a machine
 */
export function getGoodStates(
  machine: StateMachine<any, any, any>,
  goodStateTags: string[] = ['Good']
): StateValue[] {
  const goodStates: StateValue[] = [];
  
  function traverse(node: any) {
    const nodeId = node.id || node.key;
    if (nodeId && isGoodState(nodeId, machine, goodStateTags)) {
      // Use key instead of id to get the relative state name
      goodStates.push((node.key || nodeId) as StateValue);
    }
    
    if (node.states) {
      const stateValues = Object.keys(node.states).map(key => node.states[key]);
      for (const child of stateValues) {
        traverse(child);
      }
    }
  }
  
  traverse(machine);
  return goodStates;
}

/**
 * Get all Bad states from a machine
 */
export function getBadStates(
  machine: StateMachine<any, any, any>,
  badStateTags: string[] = ['Bad']
): StateValue[] {
  const badStates: StateValue[] = [];
  
  function traverse(node: any) {
    const nodeId = node.id || node.key;
    if (nodeId && isBadState(nodeId, machine, badStateTags)) {
      // Use key instead of id to get the relative state name
      badStates.push((node.key || nodeId) as StateValue);
    }
    
    if (node.states) {
      const stateValues = Object.keys(node.states).map(key => node.states[key]);
      for (const child of stateValues) {
        traverse(child);
      }
    }
  }
  
  traverse(machine);
  return badStates;
}

