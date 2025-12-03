"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = exports.getGlobal = void 0;
var environment_1 = require("./environment");
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (!environment_1.IS_PRODUCTION) {
    console.warn(
      "XState could not find a global object in this environment. Please let the maintainers know and raise an issue here: https://github.com/statelyai/xstate/issues"
    );
  }
}
exports.getGlobal = getGlobal;
function getDevTools() {
  var global = getGlobal();
  if (global && "__xstate__" in global) {
    return global.__xstate__;
  }
  return undefined;
}
function registerService(service) {
  if (!getGlobal()) {
    return;
  }
  var devTools = getDevTools();
  if (devTools) {
    devTools.register(service);
  }
}
exports.registerService = registerService;
