/**
 * Trace Collection & Replay
 * Handles trace collection, message queue, and trace replay functionality
 */
import type { Trace, MessageQueue, Configuration, RCStep } from './types';
/**
 * Simple message queue implementation
 */
export declare class SimpleMessageQueue implements MessageQueue {
    private messages;
    append(message: any): void;
    dequeue(): any | undefined;
    isEmpty(): boolean;
    length(): number;
    clear(): void;
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
export declare function getRCStepBSM(trace: Trace, msg: any, RC_B: RCStep[], gamma_B: Configuration): {
    rc_step: RCStep | null;
    gamma: Configuration;
};
/**
 * Get RC-step for PSM based on event data and message
 *
 * @param eventData Event data from BSM (γ_1.E)
 * @param msg Message from queue
 * @param RC_P RC-steps of PSM
 * @param gamma_P Current PSM configuration
 * @returns RC-step and updated configuration
 */
export declare function getRCStepPSM(eventData: any, msg: any, RC_P: RCStep[], gamma_P: Configuration): {
    rc_step: RCStep | null;
    gamma: Configuration;
};
/**
 * Remove matching trace from traces array
 */
export declare function removeMatchingTrace(traces: Trace[], trace: Trace): void;
/**
 * Initialize message queue with startUp message
 */
export declare function initializeMessageQueue(): MessageQueue;
//# sourceMappingURL=traceReplay.d.ts.map