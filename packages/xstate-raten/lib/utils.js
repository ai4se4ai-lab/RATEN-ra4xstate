"use strict";
/**
 * Utility functions for RATEN
 */
var __values =
  (this && this.__values) ||
  function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(
      s ? "Object is not iterable." : "Symbol.iterator is not defined."
    );
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBadStates =
  exports.getGoodStates =
  exports.compareStates =
  exports.isMatched =
  exports.resolveStatePath =
  exports.getStateNode =
  exports.isBadState =
  exports.isGoodState =
    void 0;
/**
 * Check if a state is classified as Good
 */
function isGoodState(state, machine, goodStateTags) {
  var e_1, _a;
  if (goodStateTags === void 0) {
    goodStateTags = ["Good"];
  }
  // First check if state name contains "Good" (simple fallback)
  var stateStr = typeof state === "string" ? state : JSON.stringify(state);
  if (stateStr.toLowerCase().includes("good")) {
    return true;
  }
  // Try to get state node and check tags
  var stateNode = getStateNode(machine, state);
  if (stateNode) {
    try {
      // Check tags (StateNode.tags is an array, not a Set)
      for (
        var goodStateTags_1 = __values(goodStateTags),
          goodStateTags_1_1 = goodStateTags_1.next();
        !goodStateTags_1_1.done;
        goodStateTags_1_1 = goodStateTags_1.next()
      ) {
        var tag = goodStateTags_1_1.value;
        if (stateNode.tags && stateNode.tags.includes(tag)) {
          return true;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (
          goodStateTags_1_1 &&
          !goodStateTags_1_1.done &&
          (_a = goodStateTags_1.return)
        )
          _a.call(goodStateTags_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  }
  return false;
}
exports.isGoodState = isGoodState;
/**
 * Check if a state is classified as Bad
 */
function isBadState(state, machine, badStateTags) {
  var e_2, _a;
  if (badStateTags === void 0) {
    badStateTags = ["Bad"];
  }
  // First check if state name contains "Bad" (simple fallback)
  var stateStr = typeof state === "string" ? state : JSON.stringify(state);
  if (stateStr.toLowerCase().includes("bad")) {
    return true;
  }
  // Try to get state node and check tags
  var stateNode = getStateNode(machine, state);
  if (stateNode) {
    try {
      // Check tags (StateNode.tags is an array, not a Set)
      for (
        var badStateTags_1 = __values(badStateTags),
          badStateTags_1_1 = badStateTags_1.next();
        !badStateTags_1_1.done;
        badStateTags_1_1 = badStateTags_1.next()
      ) {
        var tag = badStateTags_1_1.value;
        if (stateNode.tags && stateNode.tags.includes(tag)) {
          return true;
        }
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (
          badStateTags_1_1 &&
          !badStateTags_1_1.done &&
          (_a = badStateTags_1.return)
        )
          _a.call(badStateTags_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  }
  return false;
}
exports.isBadState = isBadState;
/**
 * Get StateNode from machine by state value
 */
function getStateNode(machine, stateValue) {
  try {
    if (typeof stateValue === "string") {
      return machine.getStateNodeById(stateValue) || null;
    }
    // For nested states, resolve the path
    var statePath = resolveStatePath(stateValue);
    return machine.getStateNodeById(statePath) || null;
  } catch (_a) {
    return null;
  }
}
exports.getStateNode = getStateNode;
/**
 * Resolve state path from state value
 */
function resolveStatePath(stateValue) {
  if (typeof stateValue === "string") {
    return stateValue;
  }
  // For nested states, create a path
  var parts = [];
  function traverse(obj, prefix) {
    if (prefix === void 0) {
      prefix = "";
    }
    for (var key in obj) {
      if (typeof obj[key] === "string") {
        parts.push(
          prefix
            ? "".concat(prefix, ".").concat(key, ".").concat(obj[key])
            : "".concat(key, ".").concat(obj[key])
        );
      } else if (typeof obj[key] === "object") {
        traverse(obj[key], prefix ? "".concat(prefix, ".").concat(key) : key);
      }
    }
  }
  traverse(stateValue);
  return parts[0] || "";
}
exports.resolveStatePath = resolveStatePath;
/**
 * Check if a transition matches a rule set
 */
function isMatched(rules, sourceState, targetState) {
  return rules.some(function (rule) {
    var sourceMatch = compareStates(rule.source, sourceState);
    var targetMatch = compareStates(rule.target, targetState);
    return sourceMatch && targetMatch;
  });
}
exports.isMatched = isMatched;
/**
 * Compare two state values for equality
 */
function compareStates(state1, state2) {
  if (typeof state1 === "string" && typeof state2 === "string") {
    return state1 === state2;
  }
  return JSON.stringify(state1) === JSON.stringify(state2);
}
exports.compareStates = compareStates;
/**
 * Get all Good states from a machine
 */
function getGoodStates(machine, goodStateTags) {
  if (goodStateTags === void 0) {
    goodStateTags = ["Good"];
  }
  var goodStates = [];
  function traverse(node) {
    var e_3, _a;
    var nodeId = node.id || node.key;
    if (nodeId && isGoodState(nodeId, machine, goodStateTags)) {
      // Use key instead of id to get the relative state name
      goodStates.push(node.key || nodeId);
    }
    if (node.states) {
      var stateValues = Object.keys(node.states).map(function (key) {
        return node.states[key];
      });
      try {
        for (
          var stateValues_1 = __values(stateValues),
            stateValues_1_1 = stateValues_1.next();
          !stateValues_1_1.done;
          stateValues_1_1 = stateValues_1.next()
        ) {
          var child = stateValues_1_1.value;
          traverse(child);
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (
            stateValues_1_1 &&
            !stateValues_1_1.done &&
            (_a = stateValues_1.return)
          )
            _a.call(stateValues_1);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
    }
  }
  traverse(machine);
  return goodStates;
}
exports.getGoodStates = getGoodStates;
/**
 * Get all Bad states from a machine
 */
function getBadStates(machine, badStateTags) {
  if (badStateTags === void 0) {
    badStateTags = ["Bad"];
  }
  var badStates = [];
  function traverse(node) {
    var e_4, _a;
    var nodeId = node.id || node.key;
    if (nodeId && isBadState(nodeId, machine, badStateTags)) {
      // Use key instead of id to get the relative state name
      badStates.push(node.key || nodeId);
    }
    if (node.states) {
      var stateValues = Object.keys(node.states).map(function (key) {
        return node.states[key];
      });
      try {
        for (
          var stateValues_2 = __values(stateValues),
            stateValues_2_1 = stateValues_2.next();
          !stateValues_2_1.done;
          stateValues_2_1 = stateValues_2.next()
        ) {
          var child = stateValues_2_1.value;
          traverse(child);
        }
      } catch (e_4_1) {
        e_4 = { error: e_4_1 };
      } finally {
        try {
          if (
            stateValues_2_1 &&
            !stateValues_2_1.done &&
            (_a = stateValues_2.return)
          )
            _a.call(stateValues_2);
        } finally {
          if (e_4) throw e_4.error;
        }
      }
    }
  }
  traverse(machine);
  return badStates;
}
exports.getBadStates = getBadStates;
