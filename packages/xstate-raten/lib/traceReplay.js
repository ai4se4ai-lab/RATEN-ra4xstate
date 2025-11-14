"use strict";
/**
 * Trace Collection & Replay
 * Handles trace collection, message queue, and trace replay functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMessageQueue = exports.removeMatchingTrace = exports.getRCStepPSM = exports.getRCStepBSM = exports.SimpleMessageQueue = void 0;
var configuration_1 = require("./configuration");
/**
 * Simple message queue implementation
 */
var SimpleMessageQueue = /** @class */ (function () {
    function SimpleMessageQueue() {
        this.messages = [];
    }
    SimpleMessageQueue.prototype.append = function (message) {
        this.messages.push(message);
    };
    SimpleMessageQueue.prototype.dequeue = function () {
        return this.messages.shift();
    };
    SimpleMessageQueue.prototype.isEmpty = function () {
        return this.messages.length === 0;
    };
    SimpleMessageQueue.prototype.length = function () {
        return this.messages.length;
    };
    SimpleMessageQueue.prototype.clear = function () {
        this.messages = [];
    };
    return SimpleMessageQueue;
}());
exports.SimpleMessageQueue = SimpleMessageQueue;
/**
 * Get RC-step for BSM based on trace and message
 *
 * @param trace Current trace entry
 * @param msg Message from queue
 * @param RC_B RC-steps of BSM
 * @param gamma_B Current BSM configuration
 * @returns RC-step and updated configuration
 */
function getRCStepBSM(trace, msg, RC_B, gamma_B) {
    // Find matching RC-step for the event
    var matchingStep = RC_B.find(function (step) {
        return step.event === trace.event &&
            compareStateValue(step.source, gamma_B.state);
    });
    if (!matchingStep) {
        // No matching transition found
        return { rc_step: null, gamma: gamma_B };
    }
    // Replay the step to get updated configuration
    var updatedGamma = (0, configuration_1.replay)(matchingStep, gamma_B);
    return { rc_step: matchingStep, gamma: updatedGamma };
}
exports.getRCStepBSM = getRCStepBSM;
/**
 * Get RC-step for PSM based on event data and message
 *
 * @param eventData Event data from BSM (γ_1.E)
 * @param msg Message from queue
 * @param RC_P RC-steps of PSM
 * @param gamma_P Current PSM configuration
 * @returns RC-step and updated configuration
 */
function getRCStepPSM(eventData, msg, RC_P, gamma_P) {
    // Extract event type from eventData
    var eventType = (eventData === null || eventData === void 0 ? void 0 : eventData.type) || (msg === null || msg === void 0 ? void 0 : msg.type) || '';
    // Find matching RC-step for the event
    var matchingStep = RC_P.find(function (step) {
        return step.event === eventType &&
            compareStateValue(step.source, gamma_P.state);
    });
    if (!matchingStep) {
        // No matching transition found
        return { rc_step: null, gamma: gamma_P };
    }
    // Replay the step to get updated configuration
    var updatedGamma = (0, configuration_1.replay)(matchingStep, gamma_P);
    return { rc_step: matchingStep, gamma: updatedGamma };
}
exports.getRCStepPSM = getRCStepPSM;
/**
 * Compare state values for equality
 */
function compareStateValue(state1, state2) {
    if (typeof state1 === 'string' && typeof state2 === 'string') {
        return state1 === state2;
    }
    return JSON.stringify(state1) === JSON.stringify(state2);
}
/**
 * Remove matching trace from traces array
 */
function removeMatchingTrace(traces, trace) {
    var index = traces.findIndex(function (t) {
        return t.event === trace.event &&
            JSON.stringify(t.message) === JSON.stringify(trace.message);
    });
    if (index !== -1) {
        traces.splice(index, 1);
    }
}
exports.removeMatchingTrace = removeMatchingTrace;
/**
 * Initialize message queue with startUp message
 */
function initializeMessageQueue() {
    var queue = new SimpleMessageQueue();
    queue.append({ type: 'startUp' });
    return queue;
}
exports.initializeMessageQueue = initializeMessageQueue;
