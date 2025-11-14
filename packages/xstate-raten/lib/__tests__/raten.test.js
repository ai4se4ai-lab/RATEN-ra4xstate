"use strict";
/**
 * Basic tests for RATEN
 */
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var raten_1 = require("../raten");
describe('RATEN', function () {
    // Simple BSM
    var behavioralModel = (0, xstate_1.createMachine)({
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
    var propertyModel = (0, xstate_1.createMachine)({
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
    it('should create a RATEN instance', function () {
        var raten = new raten_1.RATEN(behavioralModel, propertyModel);
        expect(raten).toBeInstanceOf(raten_1.RATEN);
    });
    it('should extract RC-steps', function () {
        var raten = new raten_1.RATEN(behavioralModel, propertyModel);
        var bsmSteps = raten.getBSMRCSteps();
        var psmSteps = raten.getPSMRCSteps();
        expect(bsmSteps.length).toBeGreaterThan(0);
        expect(psmSteps.length).toBeGreaterThan(0);
    });
    it('should get transition rules', function () {
        var raten = new raten_1.RATEN(behavioralModel, propertyModel);
        var rules = raten.getTransitionRules();
        expect(rules).toHaveProperty('L1');
        expect(rules).toHaveProperty('L2');
        expect(rules).toHaveProperty('L3');
        expect(rules).toHaveProperty('L4');
        expect(Array.isArray(rules.L1)).toBe(true);
        expect(Array.isArray(rules.L2)).toBe(true);
        expect(Array.isArray(rules.L3)).toBe(true);
        expect(Array.isArray(rules.L4)).toBe(true);
    });
    it('should analyze traces', function () {
        var raten = new raten_1.RATEN(behavioralModel, propertyModel, {
            usrMAX: 100
        });
        var traces = [
            { event: 'START', message: '' }
        ];
        var result = raten.analyze(traces);
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
    it('should handle empty traces', function () {
        var raten = new raten_1.RATEN(behavioralModel, propertyModel);
        var traces = [];
        var result = raten.analyze(traces);
        expect(result.isRobust).toBe(true);
        expect(result.TTcost).toBe(0);
    });
});
