"use strict";
/**
 * RATEN - Robustness Analysis Through Execution Norms
 * Main entry point for robustness analysis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATEN = void 0;
var preprocessing_1 = require("./preprocessing");
var rcSteps_1 = require("./rcSteps");
var costComputation_1 = require("./costComputation");
var testEnhancement_1 = require("./testEnhancement");
/**
 * RATEN class for robustness analysis
 */
var RATEN = /** @class */ (function () {
    /**
     * Create a new RATEN instance
     *
     * @param BSM Behavioral State Machine
     * @param PSM Property State Machine
     * @param config Configuration options
     */
    function RATEN(BSM, PSM, config) {
        if (config === void 0) { config = {}; }
        var _a, _b, _c, _d;
        this.BSM = BSM;
        this.PSM = PSM;
        // Set default configuration
        this.config = {
            usrMAX: (_a = config.usrMAX) !== null && _a !== void 0 ? _a : 50,
            depthMAX: (_b = config.depthMAX) !== null && _b !== void 0 ? _b : 5,
            goodStateTags: (_c = config.goodStateTags) !== null && _c !== void 0 ? _c : ['Good'],
            badStateTags: (_d = config.badStateTags) !== null && _d !== void 0 ? _d : ['Bad'],
            stateClassifier: config.stateClassifier,
        };
        // Extract RC-steps
        this.RC_B = (0, rcSteps_1.extractRC)(this.BSM);
        this.RC_P = (0, rcSteps_1.extractRC)(this.PSM);
        // Preprocess PSM to get transition rules
        this.Rules = (0, preprocessing_1.preProcessPSM)(this.PSM, this.config.goodStateTags, this.config.badStateTags);
    }
    /**
     * Analyze traces for robustness
     * Implements Algorithm 2: computeCost
     *
     * @param traces Execution traces to analyze
     * @returns RobustnessResult with costs and violations
     */
    RATEN.prototype.analyze = function (traces) {
        return (0, costComputation_1.computeCost)(this.RC_B, this.RC_P, this.Rules, traces, this.BSM, this.PSM, this.config.usrMAX, this.config.depthMAX);
    };
    /**
     * Reduce test suite using property model querying
     * Implements Algorithm 4: QueryPSM
     *
     * @param testSuite Original test suite
     * @param criticalVars Critical variables to test
     * @param simulateExecution Optional function to simulate test execution
     * @returns Reduced test suite
     */
    RATEN.prototype.reduceTestSuite = function (testSuite, criticalVars, simulateExecution) {
        var _this = this;
        // Use default simulation if not provided
        var simExec = simulateExecution || (function (testCase, varName) {
            var _a;
            return ({
                state: 'good',
                context: (_a = {}, _a[varName] = testCase[varName], _a),
                machine: _this.PSM,
            });
        });
        return (0, testEnhancement_1.QueryPSM)(criticalVars, this.PSM, testSuite, simExec, this.config.badStateTags);
    };
    /**
     * Get transition rules (L1, L2, L3, L4)
     */
    RATEN.prototype.getTransitionRules = function () {
        return this.Rules;
    };
    /**
     * Get RC-steps for BSM
     */
    RATEN.prototype.getBSMRCSteps = function () {
        return this.RC_B;
    };
    /**
     * Get RC-steps for PSM
     */
    RATEN.prototype.getPSMRCSteps = function () {
        return this.RC_P;
    };
    return RATEN;
}());
exports.RATEN = RATEN;
