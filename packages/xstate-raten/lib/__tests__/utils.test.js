"use strict";
/**
 * Tests for utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var utils_1 = require("../utils");
describe('State classification utilities', function () {
    var machine = (0, xstate_1.createMachine)({
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
    it('should identify good states', function () {
        expect((0, utils_1.isGoodState)('good', machine)).toBe(true);
        expect((0, utils_1.isGoodState)('bad', machine)).toBe(false);
    });
    it('should identify bad states', function () {
        expect((0, utils_1.isBadState)('bad', machine)).toBe(true);
        expect((0, utils_1.isBadState)('good', machine)).toBe(false);
    });
    it('should get all good states', function () {
        var goodStates = (0, utils_1.getGoodStates)(machine);
        expect(goodStates).toContain('good');
        expect(goodStates).not.toContain('bad');
    });
    it('should get all bad states', function () {
        var badStates = (0, utils_1.getBadStates)(machine);
        expect(badStates).toContain('bad');
        expect(badStates).not.toContain('good');
    });
});
