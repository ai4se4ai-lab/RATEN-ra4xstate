"use strict";
/**
 * Algorithm 4: Property Model Querying for Test Enhancement
 * Filters test cases based on property model analysis
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
exports.defaultSimulateExecution = exports.queryPSM = exports.QueryPSM = void 0;
var utils_1 = require("./utils");
/**
 * Query PSM to filter test suite
 * Implements Algorithm 4 from the paper
 *
 * @param criticalVars Critical variables to test
 * @param PSM Property State Machine
 * @param testSuite Original test suite
 * @param simulateExecution Function to simulate test case execution
 * @param badStateTags Tags identifying bad states
 * @returns Reduced test suite containing only tests that reach Bad states
 */
function QueryPSM(criticalVars, PSM, testSuite, simulateExecution, badStateTags) {
    var e_1, _a, e_2, _b;
    if (badStateTags === void 0) { badStateTags = ['Bad']; }
    var reducedSuite = [];
    try {
        for (var testSuite_1 = __values(testSuite), testSuite_1_1 = testSuite_1.next(); !testSuite_1_1.done; testSuite_1_1 = testSuite_1.next()) {
            var testCase = testSuite_1_1.value;
            var wouldReachBadState = false;
            try {
                // Test with each critical variable
                for (var criticalVars_1 = (e_2 = void 0, __values(criticalVars)), criticalVars_1_1 = criticalVars_1.next(); !criticalVars_1_1.done; criticalVars_1_1 = criticalVars_1.next()) {
                    var varName = criticalVars_1_1.value;
                    // Simulate execution to get configuration
                    var config = simulateExecution(testCase, varName);
                    // Query PSM to determine resulting state
                    var state = queryPSM(PSM, config);
                    // Check if state is Bad
                    if ((0, utils_1.isBadState)(state, PSM, badStateTags)) {
                        wouldReachBadState = true;
                        break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (criticalVars_1_1 && !criticalVars_1_1.done && (_b = criticalVars_1.return)) _b.call(criticalVars_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // Include test case if it would reach a Bad state
            if (wouldReachBadState) {
                reducedSuite.push(testCase);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (testSuite_1_1 && !testSuite_1_1.done && (_a = testSuite_1.return)) _a.call(testSuite_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return reducedSuite;
}
exports.QueryPSM = QueryPSM;
/**
 * Query PSM to determine state from configuration
 *
 * @param PSM Property State Machine
 * @param config Configuration from simulated execution
 * @returns Resulting state value
 */
function queryPSM(PSM, config) {
    // Use the state from the configuration
    // In a more sophisticated implementation, this might involve
    // actually running the PSM with the configuration
    return config.state;
}
exports.queryPSM = queryPSM;
/**
 * Default simulation execution function
 * Creates a configuration from test case and variable
 */
function defaultSimulateExecution(testCase, varName) {
    var _a;
    // Extract variable value from test case
    var varValue = testCase[varName];
    // Create a simple configuration
    // In practice, this would involve more sophisticated simulation
    return {
        state: 'good',
        context: (_a = {},
            _a[varName] = varValue,
            _a),
        machine: {}, // Will be set by caller
    };
}
exports.defaultSimulateExecution = defaultSimulateExecution;
