"use strict";
/**
 * Algorithm 1: Property Model Preprocessing
 * Classifies transitions into L1, L2, L3, L4 categories
 */
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preProcessPSM = void 0;
var rcSteps_1 = require("./rcSteps");
var utils_1 = require("./utils");
/**
 * Preprocess Property State Machine (PSM)
 * Classifies all transitions into four categories:
 * - L1: Good → Good (maintaining good behavior, cost = 0)
 * - L2: Good → Bad (robustness violation, cost > 0)
 * - L3: Bad → Good (recovery, cost may be negative)
 * - L4: Bad → Bad (continued degradation, cost accumulates)
 *
 * @param PSM Property State Machine
 * @param goodStateTags Tags identifying good states (default: ['Good'])
 * @param badStateTags Tags identifying bad states (default: ['Bad'])
 * @returns Classified transition rules ⟨L1, L2, L3, L4⟩
 */
function preProcessPSM(PSM, goodStateTags, badStateTags) {
    var e_1, _a;
    if (goodStateTags === void 0) { goodStateTags = ['Good']; }
    if (badStateTags === void 0) { badStateTags = ['Bad']; }
    var L1 = [];
    var L2 = [];
    var L3 = [];
    var L4 = [];
    // Extract all RC-steps from the PSM
    var transitions = (0, rcSteps_1.extractRC)(PSM);
    try {
        // Classify each transition
        for (var transitions_1 = __values(transitions), transitions_1_1 = transitions_1.next(); !transitions_1_1.done; transitions_1_1 = transitions_1.next()) {
            var t = transitions_1_1.value;
            var sourceIsGood = (0, utils_1.isGoodState)(t.source, PSM, goodStateTags);
            var sourceIsBad = (0, utils_1.isBadState)(t.source, PSM, badStateTags);
            var targetIsGood = (0, utils_1.isGoodState)(t.target, PSM, goodStateTags);
            var targetIsBad = (0, utils_1.isBadState)(t.target, PSM, badStateTags);
            if (sourceIsGood && targetIsGood) {
                // L1: Good → Good
                L1.push(t);
            }
            else if (sourceIsGood && targetIsBad) {
                // L2: Good → Bad (robustness violation)
                L2.push(t);
            }
            else if (sourceIsBad && targetIsGood) {
                // L3: Bad → Good (recovery)
                L3.push(t);
            }
            else if (sourceIsBad && targetIsBad) {
                // L4: Bad → Bad (continued degradation)
                L4.push(t);
            }
            else {
                // If state classification is ambiguous, default to L1
                // (assume good behavior if we can't determine)
                L1.push(t);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (transitions_1_1 && !transitions_1_1.done && (_a = transitions_1.return)) _a.call(transitions_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { L1: L1, L2: L2, L3: L3, L4: L4 };
}
exports.preProcessPSM = preProcessPSM;
