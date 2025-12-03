/**
 * Type definitions for RATEN
 */
import type { StateMachine, StateValue } from "xstate";
/**
 * Configuration options for RATEN analysis
 */
export interface RATENConfig {
  /**
   * Maximum acceptable total cost (usrMAX in algorithm)
   * If TTcost exceeds this value, the system is considered NotRobust
   */
  usrMAX?: number;
  /**
   * Maximum depth for back-track cost path search (depthMAX in algorithm)
   */
  depthMAX?: number;
  /**
   * Tags identifying good states (default: ['Good'])
   */
  goodStateTags?: string[];
  /**
   * Tags identifying bad states (default: ['Bad'])
   */
  badStateTags?: string[];
  /**
   * Custom function for state classification
   * If provided, overrides tag-based classification
   */
  stateClassifier?: (
    state: StateValue,
    machine: StateMachine<any, any, any>
  ) => "Good" | "Bad" | "Unknown";
}
export interface RequiredRATENConfig {
  usrMAX: number;
  depthMAX: number;
  goodStateTags: string[];
  badStateTags: string[];
  stateClassifier?: (
    state: StateValue,
    machine: StateMachine<any, any, any>
  ) => "Good" | "Bad" | "Unknown";
}
/**
 * Result of robustness analysis
 */
export interface RobustnessResult {
  /**
   * Total robustness cost (TTcost = OTcost + BTcost)
   */
  TTcost: number;
  /**
   * Off-Track cost (immediate impact of deviations)
   */
  OTcost: number;
  /**
   * Back-Track cost (recovery effort)
   */
  BTcost: number;
  /**
   * Whether the system is robust (TTcost <= usrMAX)
   */
  isRobust: boolean;
  /**
   * List of robustness violations found
   */
  violations: RobustnessViolation[];
}
/**
 * Represents a robustness violation
 */
export interface RobustnessViolation {
  /**
   * Trace index where violation occurred
   */
  traceIndex: number;
  /**
   * State where violation occurred
   */
  state: StateValue;
  /**
   * Event that triggered the violation
   */
  event: string;
  /**
   * Cost at the time of violation
   */
  cost: number;
}
/**
 * Classified transition rules (L1, L2, L3, L4)
 */
export interface TransitionRules {
  /**
   * L1: Good → Good transitions (maintaining good behavior, cost = 0)
   */
  L1: RCStep[];
  /**
   * L2: Good → Bad transitions (robustness violation, cost > 0)
   */
  L2: RCStep[];
  /**
   * L3: Bad → Good transitions (recovery, cost may be negative)
   */
  L3: RCStep[];
  /**
   * L4: Bad → Bad transitions (continued degradation, cost accumulates)
   */
  L4: RCStep[];
}
/**
 * Reachability Configuration Step (RC-step)
 * Represents a transition with source, event, target, and actions
 */
export interface RCStep {
  /**
   * Source state (σ)
   */
  source: StateValue;
  /**
   * Event that triggers this transition
   */
  event: string;
  /**
   * Target state (σ')
   */
  target: StateValue;
  /**
   * Actions associated with this transition
   */
  actions: any[];
  /**
   * Optional cost value extracted from actions
   */
  cost?: number;
}
/**
 * Configuration (γ) representing current machine state
 */
export interface Configuration {
  /**
   * Current state (σ)
   */
  state: StateValue;
  /**
   * Context/event data (E)
   */
  context: any;
  /**
   * Event data from last transition
   */
  eventData?: any;
  /**
   * Machine instance reference
   */
  machine: StateMachine<any, any, any>;
}
/**
 * Trace entry representing an event and message
 */
export interface Trace {
  /**
   * Event type
   */
  event: string;
  /**
   * Message payload (optional)
   */
  message?: any;
}
/**
 * Message queue operations
 */
export interface MessageQueue {
  /**
   * Append a message to the queue
   */
  append(message: any): void;
  /**
   * Dequeue and return the next message
   */
  dequeue(): any | undefined;
  /**
   * Check if queue is empty
   */
  isEmpty(): boolean;
  /**
   * Get current queue length
   */
  length(): number;
}
//# sourceMappingURL=types.d.ts.map
