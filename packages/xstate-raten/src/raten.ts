/**
 * RATEN - Robustness Analysis Through Execution Norms
 * Main entry point for robustness analysis
 */

import type { StateMachine } from 'xstate';
import type { Trace, RATENConfig, RequiredRATENConfig, RobustnessResult, TransitionRules, RCStep } from './types';
import { preProcessPSM } from './preprocessing';
import { extractRC } from './rcSteps';
import { computeCost } from './costComputation';
import { QueryPSM, TestCase } from './testEnhancement';

/**
 * RATEN class for robustness analysis
 */
export class RATEN {
  private BSM: StateMachine<any, any, any>;
  private PSM: StateMachine<any, any, any>;
  private config: RequiredRATENConfig;
  private RC_B: RCStep[];
  private RC_P: RCStep[];
  private Rules: TransitionRules;

  /**
   * Create a new RATEN instance
   * 
   * @param BSM Behavioral State Machine
   * @param PSM Property State Machine
   * @param config Configuration options
   */
  constructor(
    BSM: StateMachine<any, any, any>,
    PSM: StateMachine<any, any, any>,
    config: RATENConfig = {}
  ) {
    this.BSM = BSM;
    this.PSM = PSM;
    
    // Set default configuration
    this.config = {
      usrMAX: config.usrMAX ?? 50,
      depthMAX: config.depthMAX ?? 5,
      goodStateTags: config.goodStateTags ?? ['Good'],
      badStateTags: config.badStateTags ?? ['Bad'],
      stateClassifier: config.stateClassifier,
    };
    
    // Extract RC-steps
    this.RC_B = extractRC(this.BSM);
    this.RC_P = extractRC(this.PSM);
    
    // Preprocess PSM to get transition rules
    this.Rules = preProcessPSM(
      this.PSM,
      this.config.goodStateTags,
      this.config.badStateTags
    );
  }

  /**
   * Analyze traces for robustness
   * Implements Algorithm 2: computeCost
   * 
   * @param traces Execution traces to analyze
   * @returns RobustnessResult with costs and violations
   */
  analyze(traces: Trace[]): RobustnessResult {
    return computeCost(
      this.RC_B,
      this.RC_P,
      this.Rules,
      traces,
      this.BSM,
      this.PSM,
      this.config.usrMAX,
      this.config.depthMAX
    );
  }

  /**
   * Reduce test suite using property model querying
   * Implements Algorithm 4: QueryPSM
   * 
   * @param testSuite Original test suite
   * @param criticalVars Critical variables to test
   * @param simulateExecution Optional function to simulate test execution
   * @returns Reduced test suite
   */
  reduceTestSuite(
    testSuite: TestCase[],
    criticalVars: string[],
    simulateExecution?: (testCase: TestCase, varName: string) => any
  ): TestCase[] {
    // Use default simulation if not provided
    const simExec = simulateExecution || ((testCase, varName) => ({
      state: 'good',
      context: { [varName]: testCase[varName] },
      machine: this.PSM,
    }));
    
    return QueryPSM(
      criticalVars,
      this.PSM,
      testSuite,
      simExec,
      this.config.badStateTags
    );
  }

  /**
   * Get transition rules (L1, L2, L3, L4)
   */
  getTransitionRules(): TransitionRules {
    return this.Rules;
  }

  /**
   * Get RC-steps for BSM
   */
  getBSMRCSteps(): RCStep[] {
    return this.RC_B;
  }

  /**
   * Get RC-steps for PSM
   */
  getPSMRCSteps(): RCStep[] {
    return this.RC_P;
  }
}

