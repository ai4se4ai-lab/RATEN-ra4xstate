/**
 * RATEN - Robustness Analysis Through Execution Norms
 * Main entry point for robustness analysis
 */
import type { StateMachine } from 'xstate';
import type { Trace, RATENConfig, RobustnessResult, TransitionRules, RCStep } from './types';
import { TestCase } from './testEnhancement';
/**
 * RATEN class for robustness analysis
 */
export declare class RATEN {
    private BSM;
    private PSM;
    private config;
    private RC_B;
    private RC_P;
    private Rules;
    /**
     * Create a new RATEN instance
     *
     * @param BSM Behavioral State Machine
     * @param PSM Property State Machine
     * @param config Configuration options
     */
    constructor(BSM: StateMachine<any, any, any>, PSM: StateMachine<any, any, any>, config?: RATENConfig);
    /**
     * Analyze traces for robustness
     * Implements Algorithm 2: computeCost
     *
     * @param traces Execution traces to analyze
     * @returns RobustnessResult with costs and violations
     */
    analyze(traces: Trace[]): RobustnessResult;
    /**
     * Reduce test suite using property model querying
     * Implements Algorithm 4: QueryPSM
     *
     * @param testSuite Original test suite
     * @param criticalVars Critical variables to test
     * @param simulateExecution Optional function to simulate test execution
     * @returns Reduced test suite
     */
    reduceTestSuite(testSuite: TestCase[], criticalVars: string[], simulateExecution?: (testCase: TestCase, varName: string) => any): TestCase[];
    /**
     * Get transition rules (L1, L2, L3, L4)
     */
    getTransitionRules(): TransitionRules;
    /**
     * Get RC-steps for BSM
     */
    getBSMRCSteps(): RCStep[];
    /**
     * Get RC-steps for PSM
     */
    getPSMRCSteps(): RCStep[];
}
//# sourceMappingURL=raten.d.ts.map