"use strict";
/**
 * Algorithm 2: Cost Computation
 * Calculates total robustness cost by processing execution traces
 */
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCost = void 0;
var configuration_1 = require("./configuration");
var traceReplay_1 = require("./traceReplay");
var btCost_1 = require("./btCost");
var costExtraction_1 = require("./costExtraction");
var utils_1 = require("./utils");
/**
 * Compute total robustness cost
 * Implements Algorithm 2 from the paper
 *
 * @param RC_B RC-steps of BSM
 * @param RC_P RC-steps of PSM
 * @param Rules Classified transition rules (L1, L2, L3, L4)
 * @param traces Execution traces to process
 * @param BSM Behavioral State Machine
 * @param PSM Property State Machine
 * @param usrMAX Maximum acceptable total cost
 * @param depthMAX Maximum depth for BT cost search
 * @returns RobustnessResult with costs and violations
 */
function computeCost(RC_B, RC_P, Rules, traces, BSM, PSM, usrMAX, depthMAX) {
    // Initialize configurations
    var gamma_B = (0, configuration_1.createInitialConfiguration)(BSM);
    var gamma_P = (0, configuration_1.createInitialConfiguration)(PSM);
    // Initialize costs
    var OTcost = 0;
    var BTcost = 0;
    var TTcost = 0;
    // Initialize message queue with startUp
    var M = (0, traceReplay_1.initializeMessageQueue)();
    // Unpack rules
    var L1 = Rules.L1, L2 = Rules.L2, L3 = Rules.L3, L4 = Rules.L4;
    // Copy traces array to avoid mutating original
    var inTraces = __spreadArray([], __read(traces), false);
    var violations = [];
    var traceIndex = 0;
    // Process traces until consumed
    while (inTraces.length > 0) {
        // Get next trace
        var trace = inTraces[0];
        var msg = M.dequeue();
        // Get RC-steps for BSM and PSM
        var _a = (0, traceReplay_1.getRCStepBSM)(trace, msg, RC_B, gamma_B), rc_b = _a.rc_step, gamma_1 = _a.gamma;
        var _b = (0, traceReplay_1.getRCStepPSM)(gamma_1.eventData || { type: trace.event }, msg, RC_P, gamma_P), rc_p = _b.rc_step, gamma_2 = _b.gamma;
        // Check if we have valid RC-steps
        if (!rc_b || !rc_p) {
            // No matching transition, skip this trace
            (0, traceReplay_1.removeMatchingTrace)(inTraces, trace);
            traceIndex++;
            continue;
        }
        // Determine transition classification and compute costs
        var sourceState = gamma_P.state;
        var targetState = gamma_2.state;
        if ((0, utils_1.isMatched)(L2, sourceState, targetState)) {
            // From a Good state to a Bad state: calculate OTcost and BTcost
            OTcost = (0, costExtraction_1.getCost)(gamma_P, rc_b);
            BTcost = (0, btCost_1.computeBTCost)(RC_B, RC_P, rc_b, rc_p, gamma_1, gamma_2, PSM, usrMAX, depthMAX);
        }
        else if ((0, utils_1.isMatched)(L3, sourceState, targetState)) {
            // From a Bad state to a Good state: recovery step
            OTcost = 0;
            BTcost = (0, costExtraction_1.getCost)(gamma_P, rc_b);
        }
        else if ((0, utils_1.isMatched)(L4, sourceState, targetState)) {
            // From a Bad state to a Bad state: accumulate OTcost
            OTcost = OTcost + (0, costExtraction_1.getCost)(gamma_P, rc_b);
            BTcost = (0, btCost_1.computeBTCost)(RC_B, RC_P, rc_b, rc_p, gamma_1, gamma_2, PSM, usrMAX, depthMAX);
        }
        else {
            // L1: From a Good state to a Good state: no cost
            OTcost = 0;
            BTcost = 0;
        }
        // Compute total cost
        TTcost = OTcost + BTcost;
        // Check if cost exceeds threshold
        if (TTcost > usrMAX) {
            // Record violation
            violations.push({
                traceIndex: traceIndex,
                state: targetState,
                event: trace.event,
                cost: TTcost,
            });
            // Return NotRobust result
            return {
                TTcost: TTcost,
                OTcost: OTcost,
                BTcost: BTcost,
                isRobust: false,
                violations: violations,
            };
        }
        // Update configurations
        gamma_B = (0, configuration_1.replay)(rc_b, gamma_1);
        gamma_P = (0, configuration_1.replay)(rc_p, gamma_2);
        // Remove processed trace
        (0, traceReplay_1.removeMatchingTrace)(inTraces, trace);
        traceIndex++;
    }
    // All traces processed successfully
    return {
        TTcost: TTcost,
        OTcost: OTcost,
        BTcost: BTcost,
        isRobust: true,
        violations: violations,
    };
}
exports.computeCost = computeCost;
