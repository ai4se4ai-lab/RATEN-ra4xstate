"use strict";
/**
 * Configuration Management
 * Represents γ (gamma) state - current machine configuration
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfigurationFromState = exports.replay = exports.createInitialConfiguration = void 0;
/**
 * Create initial configuration (γ_0)
 */
function createInitialConfiguration(machine) {
    return {
        state: machine.initialState.value,
        context: machine.context || {},
        machine: machine,
    };
}
exports.createInitialConfiguration = createInitialConfiguration;
/**
 * Replay an RC-step to update configuration
 * Updates the configuration state after executing an RC-step
 *
 * @param rc_step The RC-step to replay
 * @param gamma Current configuration
 * @returns Updated configuration
 */
function replay(rc_step, gamma) {
    var e_1, _a;
    // Update state to target of the transition
    var newState = rc_step.target;
    // Update context if there's event data
    var newContext = __assign({}, gamma.context);
    if (rc_step.actions && rc_step.actions.length > 0) {
        try {
            // Apply any context updates from actions
            // This is a simplified version - in practice, actions might modify context
            for (var _b = __values(rc_step.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var action = _c.value;
                if (action && typeof action === 'object' && 'assign' in action) {
                    // Handle assign actions
                    if (typeof action.assign === 'function') {
                        newContext = action.assign(newContext, { type: rc_step.event });
                    }
                    else if (typeof action.assign === 'object') {
                        newContext = __assign(__assign({}, newContext), action.assign);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return {
        state: newState,
        context: newContext,
        eventData: { type: rc_step.event },
        machine: gamma.machine,
    };
}
exports.replay = replay;
/**
 * Create a configuration from a state machine's current state
 */
function createConfigurationFromState(machine, stateValue, context) {
    return {
        state: stateValue,
        context: context || machine.context || {},
        machine: machine,
    };
}
exports.createConfigurationFromState = createConfigurationFromState;
