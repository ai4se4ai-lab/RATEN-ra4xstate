"use strict";
/**
 * Cost Extraction
 * Extracts cost values from XState actions
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
exports.getCost = void 0;
/**
 * Extract cost from actions
 * Looks for cost values in actions (e.g., setCost(10))
 *
 * @param gamma_P Current PSM configuration
 * @param rc_b BSM RC-step
 * @returns Cost value, or 0 if no cost found
 */
function getCost(gamma_P, rc_b) {
    // First, try to get cost from rc_b actions
    var costFromActions = extractCostFromActions(rc_b.actions);
    if (costFromActions !== null) {
        return costFromActions;
    }
    // If rc_b has a cost property, use it
    if (rc_b.cost !== undefined) {
        return rc_b.cost;
    }
    // Default to 0 if no cost found
    return 0;
}
exports.getCost = getCost;
/**
 * Extract cost value from action objects
 * Supports various formats:
 * - Actions with type containing cost (e.g., "setCost:10")
 * - Actions with cost property
 * - String actions like "setCost(10)"
 */
function extractCostFromActions(actions) {
    var e_1, _a;
    if (!actions || actions.length === 0) {
        return null;
    }
    try {
        for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {
            var action = actions_1_1.value;
            // Check if action has a cost property
            if (action && typeof action === 'object' && 'cost' in action) {
                return Number(action.cost) || 0;
            }
            // Check action type for cost pattern (e.g., "setCost:10")
            if (action && action.type) {
                var typeStr = String(action.type);
                var costMatch = typeStr.match(/setCost[:\s]*(-?\d+)/i);
                if (costMatch) {
                    return Number(costMatch[1]);
                }
                // Check for cost in type like "setCost(10)"
                var parenMatch = typeStr.match(/setCost\s*\(\s*(-?\d+)\s*\)/i);
                if (parenMatch) {
                    return Number(parenMatch[1]);
                }
            }
            // Check if action is a string like "setCost(10)"
            if (typeof action === 'string') {
                var strMatch = action.match(/setCost\s*\(\s*(-?\d+)\s*\)/i);
                if (strMatch) {
                    return Number(strMatch[1]);
                }
            }
            // Check action.exec if it's a function that might return cost
            if (action && typeof action.exec === 'function') {
                try {
                    var result = action.exec();
                    if (typeof result === 'number') {
                        return result;
                    }
                }
                catch (_b) {
                    // Ignore errors
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return null;
}
