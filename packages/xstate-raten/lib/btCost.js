"use strict";
/**
 * Algorithm 3: Back-Track Cost Computation
 * Calculates the cost required for the system to recover from a bad state to a good state
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
exports.computeBTCost = void 0;
var rcSteps_1 = require("./rcSteps");
var utils_1 = require("./utils");
var costExtraction_1 = require("./costExtraction");
/**
 * Maximum unsigned integer value (UINT_MAX)
 */
var UINT_MAX = 4294967295;
/**
 * Compute Back-Track cost
 * Finds minimum-cost recovery path from bad state to good state
 *
 * @param RC_B RC-steps of BSM
 * @param RC_P RC-steps of PSM
 * @param rc_b Current BSM RC-step
 * @param rc_p Current PSM RC-step
 * @param gamma_1 BSM configuration
 * @param gamma_2 PSM configuration (current bad state)
 * @param PSM Property State Machine
 * @param usrMAX Maximum acceptable cost
 * @param depthMAX Maximum search depth
 * @returns BTcost (Back-Track cost) or UINT_MAX if no path found
 */
function computeBTCost(RC_B, RC_P, rc_b, rc_p, gamma_1, gamma_2, PSM, usrMAX, depthMAX) {
    var BTcost = UINT_MAX;
    // Build graph from RC_P steps
    var graph = (0, rcSteps_1.buildGraph)(RC_P);
    var goodStates = (0, utils_1.getGoodStates)(PSM);
    if (goodStates.length === 0) {
        // No good states found, cannot recover
        return UINT_MAX;
    }
    // Try direct recovery path first (minCostPath)
    var minPath = minCostPath(gamma_2.state, PSM, RC_P, goodStates);
    if (minPath && computePathCost(minPath, gamma_2) <= usrMAX) {
        BTcost = computePathCost(minPath, gamma_2);
        return BTcost;
    }
    var _loop_1 = function (d) {
        var paths = BFSdPSM(gamma_2.state, PSM, d, RC_P, goodStates);
        if (paths.length > 0) {
            // Find path with minimum cost
            var minPathCost_1 = Math.min.apply(Math, __spreadArray([], __read(paths.map(function (p) { return computePathCost(p, gamma_2); })), false));
            var minPathIndex = paths.findIndex(function (p) { return computePathCost(p, gamma_2) === minPathCost_1; });
            var minPath_1 = paths[minPathIndex];
            BTcost = computePathCost(minPath_1, gamma_2);
            if (BTcost <= usrMAX) {
                return { value: BTcost };
            }
        }
    };
    // If direct path not found or too expensive, use BFS with increasing depth
    for (var d = 2; d <= depthMAX; d++) {
        var state_1 = _loop_1(d);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return BTcost;
}
exports.computeBTCost = computeBTCost;
/**
 * Find minimum cost path from current state to any good state
 */
function minCostPath(currentState, PSM, RC_P, goodStates) {
    var e_1, _a;
    // Use Dijkstra-like algorithm to find shortest path
    var graph = (0, rcSteps_1.buildGraph)(RC_P);
    var stateKey = stateValueToString(currentState);
    // Find all paths to good states
    var allPaths = [];
    try {
        for (var goodStates_1 = __values(goodStates), goodStates_1_1 = goodStates_1.next(); !goodStates_1_1.done; goodStates_1_1 = goodStates_1.next()) {
            var goodState = goodStates_1_1.value;
            var path = findPathToState(stateKey, stateValueToString(goodState), graph, RC_P);
            if (path) {
                allPaths.push(path);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (goodStates_1_1 && !goodStates_1_1.done && (_a = goodStates_1.return)) _a.call(goodStates_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (allPaths.length === 0) {
        return null;
    }
    // Return path with minimum cost
    return allPaths.reduce(function (min, path) {
        return path.cost < min.cost ? path : min;
    });
}
/**
 * Breadth-first search at depth d
 * Finds all paths from current state to good states at exactly depth d
 */
function BFSdPSM(currentState, PSM, depth, RC_P, goodStates) {
    var graph = (0, rcSteps_1.buildGraph)(RC_P);
    var stateKey = stateValueToString(currentState);
    var paths = [];
    var queue = [{ state: stateKey, path: [], depth: 0 }];
    var visited = new Set();
    var _loop_2 = function () {
        var e_2, _a;
        var current = queue.shift();
        if (current.depth > depth) {
            return "continue";
        }
        var visitKey = "".concat(current.state, ":").concat(current.depth);
        if (visited.has(visitKey)) {
            return "continue";
        }
        visited.add(visitKey);
        // Check if we reached a good state at the target depth
        if (current.depth === depth) {
            var stateValue_1 = stringToStateValue(current.state);
            if (goodStates.some(function (gs) { return compareStateValues(gs, stateValue_1); })) {
                paths.push({
                    steps: current.path,
                    cost: 0 // Will be computed later
                });
            }
        }
        // Explore neighbors
        var neighbors = graph.get(current.state) || [];
        try {
            for (var neighbors_1 = (e_2 = void 0, __values(neighbors)), neighbors_1_1 = neighbors_1.next(); !neighbors_1_1.done; neighbors_1_1 = neighbors_1.next()) {
                var step = neighbors_1_1.value;
                var nextState = stateValueToString(step.target);
                queue.push({
                    state: nextState,
                    path: __spreadArray(__spreadArray([], __read(current.path), false), [step], false),
                    depth: current.depth + 1
                });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (neighbors_1_1 && !neighbors_1_1.done && (_a = neighbors_1.return)) _a.call(neighbors_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    while (queue.length > 0) {
        _loop_2();
    }
    return paths;
}
/**
 * Find path from source to target state
 */
function findPathToState(source, target, graph, RC_P) {
    var e_3, _a;
    var queue = [{ state: source, path: [] }];
    var visited = new Set();
    while (queue.length > 0) {
        var current = queue.shift();
        if (current.state === target) {
            return {
                steps: current.path,
                cost: 0 // Will be computed later
            };
        }
        if (visited.has(current.state)) {
            continue;
        }
        visited.add(current.state);
        var neighbors = graph.get(current.state) || [];
        try {
            for (var neighbors_2 = (e_3 = void 0, __values(neighbors)), neighbors_2_1 = neighbors_2.next(); !neighbors_2_1.done; neighbors_2_1 = neighbors_2.next()) {
                var step = neighbors_2_1.value;
                var nextState = stateValueToString(step.target);
                if (!visited.has(nextState)) {
                    queue.push({
                        state: nextState,
                        path: __spreadArray(__spreadArray([], __read(current.path), false), [step], false)
                    });
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (neighbors_2_1 && !neighbors_2_1.done && (_a = neighbors_2.return)) _a.call(neighbors_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    return null;
}
/**
 * Compute total cost of a path
 */
function computePathCost(path, gamma) {
    var e_4, _a;
    var totalCost = 0;
    var currentGamma = gamma;
    try {
        for (var _b = __values(path.steps), _c = _b.next(); !_c.done; _c = _b.next()) {
            var step = _c.value;
            var stepCost = (0, costExtraction_1.getCost)(currentGamma, step);
            totalCost += stepCost;
            // Update gamma for next step (simplified)
            currentGamma = __assign(__assign({}, currentGamma), { state: step.target });
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return totalCost;
}
/**
 * Convert state value to string key
 */
function stateValueToString(state) {
    if (typeof state === 'string') {
        return state;
    }
    return JSON.stringify(state);
}
/**
 * Convert string key back to state value
 */
function stringToStateValue(key) {
    try {
        return JSON.parse(key);
    }
    catch (_a) {
        return key;
    }
}
/**
 * Compare two state values
 */
function compareStateValues(state1, state2) {
    if (typeof state1 === 'string' && typeof state2 === 'string') {
        return state1 === state2;
    }
    return JSON.stringify(state1) === JSON.stringify(state2);
}
