/**
 * RC-Step Extraction
 * Extracts reachability configuration steps (RC-steps) from XState machines
 */

import type { StateMachine, StateNode, StateValue } from 'xstate';
import type { RCStep } from './types';

/**
 * Extract all RC-steps from a machine
 * Each RC-step represents a transition with source, event, target, and actions
 */
export function extractRC(machine: StateMachine<any, any, any>): RCStep[] {
  const rcSteps: RCStep[] = [];
  const visited = new Set<string>();
  
  function traverse(node: any) {
    const nodeId = node.id;
    
    if (visited.has(nodeId)) {
      return;
    }
    visited.add(nodeId);
    
    // Extract transitions from this node using the transitions property
    if (node.transitions && Array.isArray(node.transitions)) {
      for (const transition of node.transitions) {
        if (transition.target && transition.target.length > 0) {
          // Get the source state node
          const sourceNode = transition.source || node;
          const sourceId = sourceNode.id || nodeId;
          
          // Get target state nodes
          for (const targetNode of transition.target) {
            const targetId = typeof targetNode === 'string' 
              ? targetNode 
              : (targetNode.id || targetNode.key);
            
            if (targetId) {
              const rcStep: RCStep = {
                source: sourceId as StateValue,
                event: transition.eventType || transition.event || '',
                target: targetId as StateValue,
                actions: transition.actions || [],
              };
              
              rcSteps.push(rcStep);
            }
          }
        }
      }
    }
    
    // Recursively traverse child states
    if (node.states) {
      const stateValues = Object.keys(node.states).map(key => node.states[key]);
      for (const child of stateValues) {
        traverse(child);
      }
    }
  }
  
  traverse(machine);
  return rcSteps;
}

/**
 * Build a graph representation of RC-steps for path finding
 */
export function buildGraph(rcSteps: RCStep[]): Map<string, RCStep[]> {
  const graph = new Map<string, RCStep[]>();
  
  for (const step of rcSteps) {
    const sourceKey = stateValueToString(step.source);
    if (!graph.has(sourceKey)) {
      graph.set(sourceKey, []);
    }
    graph.get(sourceKey)!.push(step);
  }
  
  return graph;
}

/**
 * Convert state value to string key
 */
function stateValueToString(state: StateValue): string {
  if (typeof state === 'string') {
    return state;
  }
  return JSON.stringify(state);
}

