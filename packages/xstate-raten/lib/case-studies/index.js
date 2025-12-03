"use strict";
/**
 * Case Studies Index
 * Exports all behavioral state machines (BSM) and property state machines (PSM) for RATEN evaluation
 */
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllModels =
  exports.getInstrumentedModels =
  exports.getSimpleModels =
  exports.getModelMetadata =
  exports.allModelKeys =
  exports.instrumentedModelKeys =
  exports.simpleModelKeys =
  exports.allModelsMetadata =
    void 0;
__exportStar(require("./simple-models"), exports);
__exportStar(require("./instrumented-models"), exports);
__exportStar(require("./property-models"), exports);
var simple_models_1 = require("./simple-models");
var instrumented_models_1 = require("./instrumented-models");
// Combined metadata for all models
exports.allModelsMetadata = __assign(
  __assign({}, simple_models_1.simpleModelsMetadata),
  instrumented_models_1.instrumentedModelsMetadata
);
// Model categories
exports.simpleModelKeys = ["CM", "PR", "RO", "FO"];
exports.instrumentedModelKeys = ["RCM", "RPR", "RRO", "RFO"];
exports.allModelKeys = __spreadArray(
  __spreadArray([], __read(exports.simpleModelKeys), false),
  __read(exports.instrumentedModelKeys),
  false
);
/**
 * Get model metadata by key
 */
function getModelMetadata(key) {
  return exports.allModelsMetadata[key];
}
exports.getModelMetadata = getModelMetadata;
/**
 * Get all simple models
 */
function getSimpleModels() {
  return exports.simpleModelKeys.map(function (key) {
    return __assign({ key: key }, simple_models_1.simpleModelsMetadata[key]);
  });
}
exports.getSimpleModels = getSimpleModels;
/**
 * Get all instrumented models
 */
function getInstrumentedModels() {
  return exports.instrumentedModelKeys.map(function (key) {
    return __assign(
      { key: key },
      instrumented_models_1.instrumentedModelsMetadata[key]
    );
  });
}
exports.getInstrumentedModels = getInstrumentedModels;
/**
 * Get all models
 */
function getAllModels() {
  return exports.allModelKeys.map(function (key) {
    return __assign({ key: key }, exports.allModelsMetadata[key]);
  });
}
exports.getAllModels = getAllModels;
