/**
 * Basic tests for RATEN
 */

import { createMachine } from 'xstate';
import { RATEN } from '../raten';
import type { Trace } from '../types';

describe('RATEN', () => {
  // Simple BSM
  const behavioralModel = createMachine({
    id: 'behavior',
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

  // Simple PSM with Good/Bad states
  const propertyModel = createMachine({
    id: 'property',
    initial: 'good',
    states: {
      good: {
        tags: ['Good'],
        on: {
          START: { target: 'good' },
          ERROR: { target: 'bad' }
        }
      },
      bad: {
        tags: ['Bad'],
        on: {
          RECOVER: { target: 'good' }
        }
      }
    }
  });

  it('should create a RATEN instance', () => {
    const raten = new RATEN(behavioralModel, propertyModel);
    expect(raten).toBeInstanceOf(RATEN);
  });

  it('should extract RC-steps', () => {
    const raten = new RATEN(behavioralModel, propertyModel);
    const bsmSteps = raten.getBSMRCSteps();
    const psmSteps = raten.getPSMRCSteps();
    
    expect(bsmSteps.length).toBeGreaterThan(0);
    expect(psmSteps.length).toBeGreaterThan(0);
  });

  it('should get transition rules', () => {
    const raten = new RATEN(behavioralModel, propertyModel);
    const rules = raten.getTransitionRules();
    
    expect(rules).toHaveProperty('L1');
    expect(rules).toHaveProperty('L2');
    expect(rules).toHaveProperty('L3');
    expect(rules).toHaveProperty('L4');
    expect(Array.isArray(rules.L1)).toBe(true);
    expect(Array.isArray(rules.L2)).toBe(true);
    expect(Array.isArray(rules.L3)).toBe(true);
    expect(Array.isArray(rules.L4)).toBe(true);
  });

  it('should analyze traces', () => {
    const raten = new RATEN(behavioralModel, propertyModel, {
      usrMAX: 100
    });

    const traces: Trace[] = [
      { event: 'START', message: '' }
    ];

    const result = raten.analyze(traces);
    
    expect(result).toHaveProperty('TTcost');
    expect(result).toHaveProperty('OTcost');
    expect(result).toHaveProperty('BTcost');
    expect(result).toHaveProperty('isRobust');
    expect(result).toHaveProperty('violations');
    expect(typeof result.TTcost).toBe('number');
    expect(typeof result.OTcost).toBe('number');
    expect(typeof result.BTcost).toBe('number');
    expect(typeof result.isRobust).toBe('boolean');
    expect(Array.isArray(result.violations)).toBe(true);
  });

  it('should handle empty traces', () => {
    const raten = new RATEN(behavioralModel, propertyModel);
    const traces: Trace[] = [];
    
    const result = raten.analyze(traces);
    
    expect(result.isRobust).toBe(true);
    expect(result.TTcost).toBe(0);
  });
});

