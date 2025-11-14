/**
 * Algorithm 4: Property Model Querying for Test Enhancement
 * Filters test cases based on property model analysis
 */
import type { StateMachine, StateValue } from 'xstate';
import type { Configuration } from './types';
/**
 * Test case type (generic - can be customized)
 */
export interface TestCase {
    [key: string]: any;
}
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
export declare function QueryPSM(criticalVars: string[], PSM: StateMachine<any, any, any>, testSuite: TestCase[], simulateExecution: (testCase: TestCase, varName: string) => Configuration, badStateTags?: string[]): TestCase[];
/**
 * Query PSM to determine state from configuration
 *
 * @param PSM Property State Machine
 * @param config Configuration from simulated execution
 * @returns Resulting state value
 */
export declare function queryPSM(PSM: StateMachine<any, any, any>, config: Configuration): StateValue;
/**
 * Default simulation execution function
 * Creates a configuration from test case and variable
 */
export declare function defaultSimulateExecution(testCase: TestCase, varName: string): Configuration;
//# sourceMappingURL=testEnhancement.d.ts.map