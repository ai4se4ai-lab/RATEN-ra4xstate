/**
 * Algorithm 3: Back-Track Cost Computation
 * Calculates the cost required for the system to recover from a bad state to a good state
 */

import type { StateMachine, StateValue } from 'xstate';
import type { RCStep, Configuration } from './types';
import { extractRC, buildGraph } from './rcSteps';
import { getGoodStates } from './utils';
import { getCost } from './costExtraction';

/**
 * Maximum unsigned integer value (UINT_MAX)
 */
const UINT_MAX = 4294967295;

/**
 * Path with cost information
 */
interface Path {
  steps: RCStep[];
  cost: number;
}

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
export function computeBTCost(
  RC_B: RCStep[],
  RC_P: RCStep[],
  rc_b: RCStep | null,
  rc_p: RCStep | null,
  gamma_1: Configuration,
  gamma_2: Configuration,
  PSM: StateMachine<any, any, any>,
  usrMAX: number,
  depthMAX: number
): number {
  let BTcost = UINT_MAX;
  
  // Build graph from RC_P steps
  const graph = buildGraph(RC_P);
  const goodStates = getGoodStates(PSM);
  
  if (goodStates.length === 0) {
    // No good states found, cannot recover
    return UINT_MAX;
  }
  
  // Try direct recovery path first (minCostPath)
  const minPath = minCostPath(gamma_2.state, PSM, RC_P, goodStates);
  
  if (minPath && computePathCost(minPath, gamma_2) <= usrMAX) {
    BTcost = computePathCost(minPath, gamma_2);
    return BTcost;
  }
  
  // If direct path not found or too expensive, use BFS with increasing depth
  for (let d = 2; d <= depthMAX; d++) {
    const paths = BFSdPSM(gamma_2.state, PSM, d, RC_P, goodStates);
    
    if (paths.length > 0) {
      // Find path with minimum cost
      const minPathCost = Math.min(...paths.map(p => computePathCost(p, gamma_2)));
      const minPathIndex = paths.findIndex(p => computePathCost(p, gamma_2) === minPathCost);
      const minPath = paths[minPathIndex];
      
      BTcost = computePathCost(minPath, gamma_2);
      
      if (BTcost <= usrMAX) {
        return BTcost;
      }
    }
  }
  
  return BTcost;
}

/**
 * Find minimum cost path from current state to any good state
 */
function minCostPath(
  currentState: StateValue,
  PSM: StateMachine<any, any, any>,
  RC_P: RCStep[],
  goodStates: StateValue[]
): Path | null {
  // Use Dijkstra-like algorithm to find shortest path
  const graph = buildGraph(RC_P);
  const stateKey = stateValueToString(currentState);
  
  // Find all paths to good states
  const allPaths: Path[] = [];
  
  for (const goodState of goodStates) {
    const path = findPathToState(stateKey, stateValueToString(goodState), graph, RC_P);
    if (path) {
      allPaths.push(path);
    }
  }
  
  if (allPaths.length === 0) {
    return null;
  }
  
  // Return path with minimum cost
  return allPaths.reduce((min, path) => 
    path.cost < min.cost ? path : min
  );
}

/**
 * Breadth-first search at depth d
 * Finds all paths from current state to good states at exactly depth d
 */
function BFSdPSM(
  currentState: StateValue,
  PSM: StateMachine<any, any, any>,
  depth: number,
  RC_P: RCStep[],
  goodStates: StateValue[]
): Path[] {
  const graph = buildGraph(RC_P);
  const stateKey = stateValueToString(currentState);
  const paths: Path[] = [];
  
  // BFS with depth limit
  interface QueueItem {
    state: string;
    path: RCStep[];
    depth: number;
  }
  
  const queue: QueueItem[] = [{ state: stateKey, path: [], depth: 0 }];
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current.depth > depth) {
      continue;
    }
    
    const visitKey = `${current.state}:${current.depth}`;
    if (visited.has(visitKey)) {
      continue;
    }
    visited.add(visitKey);
    
    // Check if we reached a good state at the target depth
    if (current.depth === depth) {
      const stateValue = stringToStateValue(current.state);
      if (goodStates.some(gs => compareStateValues(gs, stateValue))) {
        paths.push({
          steps: current.path,
          cost: 0 // Will be computed later
        });
      }
    }
    
    // Explore neighbors
    const neighbors = graph.get(current.state) || [];
    for (const step of neighbors) {
      const nextState = stateValueToString(step.target);
      queue.push({
        state: nextState,
        path: [...current.path, step],
        depth: current.depth + 1
      });
    }
  }
  
  return paths;
}

/**
 * Find path from source to target state
 */
function findPathToState(
  source: string,
  target: string,
  graph: Map<string, RCStep[]>,
  RC_P: RCStep[]
): Path | null {
  // Simple BFS to find path
  interface QueueItem {
    state: string;
    path: RCStep[];
  }
  
  const queue: QueueItem[] = [{ state: source, path: [] }];
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current.state === target) {
      return {
        steps: current.path,
        cost: 0 // Will be computed later
      };
    }
    
    if (visited.has(current.state)) {
      continue;
    }
    visited.add(current.state);
    
    const neighbors = graph.get(current.state) || [];
    for (const step of neighbors) {
      const nextState = stateValueToString(step.target);
      if (!visited.has(nextState)) {
        queue.push({
          state: nextState,
          path: [...current.path, step]
        });
      }
    }
  }
  
  return null;
}

/**
 * Compute total cost of a path
 */
function computePathCost(path: Path, gamma: Configuration): number {
  let totalCost = 0;
  let currentGamma = gamma;
  
  for (const step of path.steps) {
    const stepCost = getCost(currentGamma, step);
    totalCost += stepCost;
    // Update gamma for next step (simplified)
    currentGamma = {
      ...currentGamma,
      state: step.target
    };
  }
  
  return totalCost;
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

/**
 * Convert string key back to state value
 */
function stringToStateValue(key: string): StateValue {
  try {
    return JSON.parse(key);
  } catch {
    return key;
  }
}

/**
 * Compare two state values
 */
function compareStateValues(state1: StateValue, state2: StateValue): boolean {
  if (typeof state1 === 'string' && typeof state2 === 'string') {
    return state1 === state2;
  }
  return JSON.stringify(state1) === JSON.stringify(state2);
}

