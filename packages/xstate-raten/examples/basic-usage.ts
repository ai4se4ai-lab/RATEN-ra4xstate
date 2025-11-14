/**
 * Basic RATEN Usage Example
 * Demonstrates simple robustness analysis with BSM and PSM
 */

import { createMachine } from 'xstate';
import { RATEN } from '../src/raten';
import type { Trace } from '../src/types';

// Define Behavioral State Machine (BSM)
const behavioralModel = createMachine({
  id: 'mySystem',
  initial: 'idle',
  states: {
    idle: {
      on: {
        START: { target: 'active' },
        ERROR: { target: 'error' }
      }
    },
    active: {
      on: {
        STOP: { target: 'idle' },
        ERROR: { target: 'error' }
      }
    },
    error: {
      on: {
        RECOVER: { target: 'idle' }
      }
    }
  }
});

// Define Property State Machine (PSM)
const propertyModel = createMachine({
  id: 'requirements',
  initial: 'good',
  states: {
    good: {
      tags: ['Good'],
      on: {
        START: { 
          target: 'good', 
          actions: 'setCost(0)' 
        },
        ERROR: { 
          target: 'bad', 
          actions: 'setCost(10)' 
        }
      }
    },
    bad: {
      tags: ['Bad'],
      on: {
        RECOVER: { 
          target: 'good', 
          actions: 'setCost(-5)' 
        },
        ERROR: { 
          target: 'bad', 
          actions: 'setCost(5)' 
        }
      }
    }
  }
});

// Initialize RATEN
const raten = new RATEN(behavioralModel, propertyModel, {
  usrMAX: 50,
  depthMAX: 5
});

// Define execution traces
const traces: Trace[] = [
  { event: 'START', message: '' },
  { event: 'ERROR', message: '' },
  { event: 'RECOVER', message: '' }
];

// Perform robustness analysis
const result = raten.analyze(traces);

console.log('Robustness Analysis Results:');
console.log('Total Cost (TTcost):', result.TTcost);
console.log('Off-Track Cost (OTcost):', result.OTcost);
console.log('Back-Track Cost (BTcost):', result.BTcost);
console.log('Is Robust:', result.isRobust);
console.log('Violations:', result.violations);

