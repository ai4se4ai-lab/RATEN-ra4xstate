"use strict";
/**
 * RC-Step Extraction
 * Extracts reachability configuration steps (RC-steps) from XState machines
 */
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
exports.buildGraph = exports.extractRC = void 0;
/**
 * Extract all RC-steps from a machine
 * Each RC-step represents a transition with source, event, target, and actions
 */
function extractRC(machine) {
    var rcSteps = [];
    var visited = new Set();
    function traverse(node) {
        var e_1, _a, e_2, _b;
        var nodeId = node.id;
        if (visited.has(nodeId)) {
            return;
        }
        visited.add(nodeId);
        // Extract transitions from this node
        // Use the machine's transition system to get all possible transitions
        if (node.ownEvents && node.ownEvents.length > 0) {
            try {
                for (var _c = __values(node.ownEvents), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var eventType = _d.value;
                    try {
                        // Get transitions for this event from this state
                        var nextState = machine.transition(node.id, { type: eventType });
                        if (nextState && nextState.value !== node.id) {
                            // Transition exists and changes state
                            var rcStep = {
                                source: node.id,
                                event: eventType,
                                target: nextState.value,
                                actions: nextState.actions || [],
                            };
                            rcSteps.push(rcStep);
                        }
                    }
                    catch (e) {
                        // Ignore errors for invalid transitions
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        // Recursively traverse child states
        var stateValues = Object.keys(node.states).map(function (key) { return node.states[key]; });
        try {
            for (var stateValues_1 = __values(stateValues), stateValues_1_1 = stateValues_1.next(); !stateValues_1_1.done; stateValues_1_1 = stateValues_1.next()) {
                var child = stateValues_1_1.value;
                traverse(child);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (stateValues_1_1 && !stateValues_1_1.done && (_b = stateValues_1.return)) _b.call(stateValues_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    traverse(machine);
    return rcSteps;
}
exports.extractRC = extractRC;
/**
 * Build a graph representation of RC-steps for path finding
 */
function buildGraph(rcSteps) {
    var e_3, _a;
    var graph = new Map();
    try {
        for (var rcSteps_1 = __values(rcSteps), rcSteps_1_1 = rcSteps_1.next(); !rcSteps_1_1.done; rcSteps_1_1 = rcSteps_1.next()) {
            var step = rcSteps_1_1.value;
            var sourceKey = stateValueToString(step.source);
            if (!graph.has(sourceKey)) {
                graph.set(sourceKey, []);
            }
            graph.get(sourceKey).push(step);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (rcSteps_1_1 && !rcSteps_1_1.done && (_a = rcSteps_1.return)) _a.call(rcSteps_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return graph;
}
exports.buildGraph = buildGraph;
/**
 * Convert state value to string key
 */
function stateValueToString(state) {
    if (typeof state === 'string') {
        return state;
    }
    return JSON.stringify(state);
}
