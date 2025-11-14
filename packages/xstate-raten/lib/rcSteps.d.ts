/**
 * RC-Step Extraction
 * Extracts reachability configuration steps (RC-steps) from XState machines
 */
import type { StateMachine } from 'xstate';
import type { RCStep } from './types';
/**
 * Extract all RC-steps from a machine
 * Each RC-step represents a transition with source, event, target, and actions
 */
export declare function extractRC(machine: StateMachine<any, any, any>): RCStep[];
/**
 * Build a graph representation of RC-steps for path finding
 */
export declare function buildGraph(rcSteps: RCStep[]): Map<string, RCStep[]>;
//# sourceMappingURL=rcSteps.d.ts.map