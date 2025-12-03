"use strict";
/**
 * @xstate/raten - RATEN (Robustness Analysis Through Execution Norms) extension for XState
 *
 * This package provides cost-based robustness evaluation for XState machines,
 * including property model integration, trace replay, and test suite optimization.
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeBTCost =
  exports.computeCost =
  exports.extractRC =
  exports.preProcessPSM =
  exports.queryPSM =
  exports.QueryPSM =
  exports.RATEN =
    void 0;
var raten_1 = require("./raten");
Object.defineProperty(exports, "RATEN", {
  enumerable: true,
  get: function () {
    return raten_1.RATEN;
  },
});
// Export utility functions
var testEnhancement_1 = require("./testEnhancement");
Object.defineProperty(exports, "QueryPSM", {
  enumerable: true,
  get: function () {
    return testEnhancement_1.QueryPSM;
  },
});
Object.defineProperty(exports, "queryPSM", {
  enumerable: true,
  get: function () {
    return testEnhancement_1.queryPSM;
  },
});
var preprocessing_1 = require("./preprocessing");
Object.defineProperty(exports, "preProcessPSM", {
  enumerable: true,
  get: function () {
    return preprocessing_1.preProcessPSM;
  },
});
var rcSteps_1 = require("./rcSteps");
Object.defineProperty(exports, "extractRC", {
  enumerable: true,
  get: function () {
    return rcSteps_1.extractRC;
  },
});
var costComputation_1 = require("./costComputation");
Object.defineProperty(exports, "computeCost", {
  enumerable: true,
  get: function () {
    return costComputation_1.computeCost;
  },
});
var btCost_1 = require("./btCost");
Object.defineProperty(exports, "computeBTCost", {
  enumerable: true,
  get: function () {
    return btCost_1.computeBTCost;
  },
});
// Export case studies
__exportStar(require("./case-studies"), exports);
// Export evaluation module
__exportStar(require("./evaluation"), exports);
