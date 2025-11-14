/**
 * Test Enhancement Example
 * Demonstrates test suite reduction using property model querying
 */

import { createMachine, assign } from 'xstate';
import { RATEN } from '../src/raten';
import type { TestCase } from '../src/testEnhancement';

// Define Property State Machine (PSM)
const propertyModel = createMachine({
  id: 'requirements',
  initial: 'good',
  context: {
    value: 0
  },
  states: {
    good: {
      tags: ['Good'],
      on: {
        INCREMENT: {
          target: 'good',
          actions: assign({ value: (ctx) => ctx.value + 1 })
        },
        SET_HIGH: {
          target: 'bad',
          actions: assign({ value: 100 })
        }
      }
    },
    bad: {
      tags: ['Bad'],
      on: {
        RESET: {
          target: 'good',
          actions: assign({ value: 0 })
        }
      }
    }
  }
});

// Simple BSM for this example
const behavioralModel = createMachine({
  id: 'system',
  initial: 'idle',
  states: {
    idle: {}
  }
});

// Initialize RATEN
const raten = new RATEN(behavioralModel, propertyModel);

// Original test suite
const originalTestSuite: TestCase[] = [
  { value: 10, action: 'INCREMENT' },
  { value: 50, action: 'SET_HIGH' },
  { value: 20, action: 'INCREMENT' },
  { value: 100, action: 'SET_HIGH' },
  { value: 5, action: 'INCREMENT' }
];

// Critical variables to test
const criticalVars = ['value'];

// Simulate execution function
function simulateExecution(testCase: TestCase, varName: string) {
  // Simulate what state the PSM would be in with this variable value
  const state = testCase[varName] >= 100 ? 'bad' : 'good';
  
  return {
    state,
    context: { [varName]: testCase[varName] },
    machine: propertyModel
  };
}

// Reduce test suite
const reducedSuite = raten.reduceTestSuite(
  originalTestSuite,
  criticalVars,
  simulateExecution
);

console.log('Original test suite size:', originalTestSuite.length);
console.log('Reduced test suite size:', reducedSuite.length);
console.log('Reduction:', ((1 - reducedSuite.length / originalTestSuite.length) * 100).toFixed(2) + '%');
console.log('Reduced tests:', reducedSuite);

