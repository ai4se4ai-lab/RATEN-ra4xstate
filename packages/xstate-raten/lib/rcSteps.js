"use strict";
/**
 * RC-Step Extraction
 * Extracts reachability configuration steps (RC-steps) from XState machines
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
exports.buildGraph = exports.extractRC = void 0;
/**
 * Extract all RC-steps from a machine
 * Each RC-step represents a transition with source, event, target, and actions
 */
function extractRC(machine) {
  var rcSteps = [];
  var visited = new Set();
  function traverse(node) {
    var e_1, _a, e_2, _b, e_3, _c;
    var nodeId = node.id;
    if (visited.has(nodeId)) {
      return;
    }
    visited.add(nodeId);
    // Extract transitions from this node using the transitions property
    if (node.transitions && Array.isArray(node.transitions)) {
      try {
        for (
          var _d = __values(node.transitions), _e = _d.next();
          !_e.done;
          _e = _d.next()
        ) {
          var transition = _e.value;
          if (transition.target && transition.target.length > 0) {
            // Get the source state node
            var sourceNode = transition.source || node;
            var sourceId = sourceNode.id || nodeId;
            try {
              // Get target state nodes
              for (
                var _f = ((e_2 = void 0), __values(transition.target)),
                  _g = _f.next();
                !_g.done;
                _g = _f.next()
              ) {
                var targetNode = _g.value;
                var targetId =
                  typeof targetNode === "string"
                    ? targetNode
                    : targetNode.id || targetNode.key;
                if (targetId) {
                  var rcStep = {
                    source: sourceId,
                    event: transition.eventType || transition.event || "",
                    target: targetId,
                    actions: transition.actions || [],
                  };
                  rcSteps.push(rcStep);
                }
              }
            } catch (e_2_1) {
              e_2 = { error: e_2_1 };
            } finally {
              try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
              } finally {
                if (e_2) throw e_2.error;
              }
            }
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }
    // Recursively traverse child states
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
            (_c = stateValues_1.return)
          )
            _c.call(stateValues_1);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
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
  var e_4, _a;
  var graph = new Map();
  try {
    for (
      var rcSteps_1 = __values(rcSteps), rcSteps_1_1 = rcSteps_1.next();
      !rcSteps_1_1.done;
      rcSteps_1_1 = rcSteps_1.next()
    ) {
      var step = rcSteps_1_1.value;
      var sourceKey = stateValueToString(step.source);
      if (!graph.has(sourceKey)) {
        graph.set(sourceKey, []);
      }
      graph.get(sourceKey).push(step);
    }
  } catch (e_4_1) {
    e_4 = { error: e_4_1 };
  } finally {
    try {
      if (rcSteps_1_1 && !rcSteps_1_1.done && (_a = rcSteps_1.return))
        _a.call(rcSteps_1);
    } finally {
      if (e_4) throw e_4.error;
    }
  }
  return graph;
}
exports.buildGraph = buildGraph;
/**
 * Convert state value to string key
 */
function stateValueToString(state) {
  if (typeof state === "string") {
    return state;
  }
  return JSON.stringify(state);
}
