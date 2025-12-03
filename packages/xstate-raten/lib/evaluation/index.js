"use strict";
/**
 * RATEN Evaluation Module
 *
 * Exports all evaluation components for reproducing research paper results
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
exports.generateSummaryTable =
  exports.runFullMRegTestEvaluation =
  exports.formatCompoundAsCSV =
  exports.formatCompoundAsJSON =
  exports.formatAsLatexTable3 =
  exports.runFullCompoundEvaluation =
  exports.formatAsCSV =
  exports.formatAsJSON =
  exports.formatAsLatexTable2 =
  exports.runBasicEvaluation =
    void 0;
// Mutant generators
__exportStar(require("./mutant-generators"), exports);
// Trace generators
__exportStar(require("./trace-generators"), exports);
// Basic strategy evaluation (Table 2)
__exportStar(require("./basic-evaluation"), exports);
// Compound strategy evaluation (Table 3)
__exportStar(require("./compound-evaluation"), exports);
// MRegTest integration evaluation (Figures 4-6)
__exportStar(require("./mregtest-evaluation"), exports);
// Re-export for convenience
var basic_evaluation_1 = require("./basic-evaluation");
Object.defineProperty(exports, "runBasicEvaluation", {
  enumerable: true,
  get: function () {
    return basic_evaluation_1.runBasicEvaluation;
  },
});
Object.defineProperty(exports, "formatAsLatexTable2", {
  enumerable: true,
  get: function () {
    return basic_evaluation_1.formatAsLatexTable2;
  },
});
Object.defineProperty(exports, "formatAsJSON", {
  enumerable: true,
  get: function () {
    return basic_evaluation_1.formatAsJSON;
  },
});
Object.defineProperty(exports, "formatAsCSV", {
  enumerable: true,
  get: function () {
    return basic_evaluation_1.formatAsCSV;
  },
});
var compound_evaluation_1 = require("./compound-evaluation");
Object.defineProperty(exports, "runFullCompoundEvaluation", {
  enumerable: true,
  get: function () {
    return compound_evaluation_1.runFullCompoundEvaluation;
  },
});
Object.defineProperty(exports, "formatAsLatexTable3", {
  enumerable: true,
  get: function () {
    return compound_evaluation_1.formatAsLatexTable3;
  },
});
Object.defineProperty(exports, "formatCompoundAsJSON", {
  enumerable: true,
  get: function () {
    return compound_evaluation_1.formatCompoundAsJSON;
  },
});
Object.defineProperty(exports, "formatCompoundAsCSV", {
  enumerable: true,
  get: function () {
    return compound_evaluation_1.formatCompoundAsCSV;
  },
});
var mregtest_evaluation_1 = require("./mregtest-evaluation");
Object.defineProperty(exports, "runFullMRegTestEvaluation", {
  enumerable: true,
  get: function () {
    return mregtest_evaluation_1.runFullMRegTestEvaluation;
  },
});
Object.defineProperty(exports, "generateSummaryTable", {
  enumerable: true,
  get: function () {
    return mregtest_evaluation_1.generateSummaryTable;
  },
});
