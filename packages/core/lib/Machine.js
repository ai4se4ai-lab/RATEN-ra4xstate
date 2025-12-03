"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMachine = exports.Machine = void 0;
var StateNode_1 = require("./StateNode");
var environment_1 = require("./environment");
var warned = false;
function Machine(config, options, initialContext) {
  if (initialContext === void 0) {
    initialContext = config.context;
  }
  return new StateNode_1.StateNode(config, options, initialContext);
}
exports.Machine = Machine;
function createMachine(config, options) {
  if (
    !environment_1.IS_PRODUCTION &&
    !config.predictableActionArguments &&
    !warned
  ) {
    warned = true;
    console.warn(
      "It is highly recommended to set `predictableActionArguments` to `true` when using `createMachine`. https://xstate.js.org/docs/guides/actions.html"
    );
  }
  return new StateNode_1.StateNode(config, options);
}
exports.createMachine = createMachine;
