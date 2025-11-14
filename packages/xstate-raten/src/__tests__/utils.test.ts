/**
 * Tests for utility functions
 */

import { createMachine } from 'xstate';
import { isGoodState, isBadState, getGoodStates, getBadStates } from '../utils';

describe('State classification utilities', () => {
  const machine = createMachine({
    id: 'test',
    initial: 'good',
    states: {
      good: {
        tags: ['Good'],
        on: {
          EVENT: { target: 'bad' }
        }
      },
      bad: {
        tags: ['Bad'],
        on: {
          EVENT: { target: 'good' }
        }
      }
    }
  });

  it('should identify good states', () => {
    expect(isGoodState('good', machine)).toBe(true);
    expect(isGoodState('bad', machine)).toBe(false);
  });

  it('should identify bad states', () => {
    expect(isBadState('bad', machine)).toBe(true);
    expect(isBadState('good', machine)).toBe(false);
  });

  it('should get all good states', () => {
    const goodStates = getGoodStates(machine);
    expect(goodStates).toContain('good');
    expect(goodStates).not.toContain('bad');
  });

  it('should get all bad states', () => {
    const badStates = getBadStates(machine);
    expect(badStates).toContain('bad');
    expect(badStates).not.toContain('good');
  });
});

