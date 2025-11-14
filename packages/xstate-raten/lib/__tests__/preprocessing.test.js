"use strict";
/**
 * Tests for preprocessing (Algorithm 1)
 */
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var preprocessing_1 = require("../preprocessing");
describe('preProcessPSM', function () {
    it('should classify transitions correctly', function () {
        var psm = (0, xstate_1.createMachine)({
            id: 'property',
            initial: 'good',
            states: {
                good: {
                    tags: ['Good'],
                    on: {
                        GOOD_TO_GOOD: { target: 'good' },
                        GOOD_TO_BAD: { target: 'bad' }
                    }
                },
                bad: {
                    tags: ['Bad'],
                    on: {
                        BAD_TO_GOOD: { target: 'good' },
                        BAD_TO_BAD: { target: 'bad' }
                    }
                }
            }
        });
        var rules = (0, preprocessing_1.preProcessPSM)(psm);
        // Should have L1 (Good -> Good)
        expect(rules.L1.length).toBeGreaterThan(0);
        // Should have L2 (Good -> Bad)
        expect(rules.L2.length).toBeGreaterThan(0);
        // Should have L3 (Bad -> Good)
        expect(rules.L3.length).toBeGreaterThan(0);
        // Should have L4 (Bad -> Bad)
        expect(rules.L4.length).toBeGreaterThan(0);
    });
    it('should handle machines with only good states', function () {
        var psm = (0, xstate_1.createMachine)({
            id: 'property',
            initial: 'good',
            states: {
                good: {
                    tags: ['Good'],
                    on: {
                        EVENT: { target: 'good' }
                    }
                }
            }
        });
        var rules = (0, preprocessing_1.preProcessPSM)(psm);
        // All transitions should be L1 (Good -> Good)
        expect(rules.L1.length).toBeGreaterThan(0);
        expect(rules.L2.length).toBe(0);
        expect(rules.L3.length).toBe(0);
        expect(rules.L4.length).toBe(0);
    });
});
