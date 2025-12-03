"use strict";
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
exports.resolveActions =
  exports.choose =
  exports.escalate =
  exports.forwardTo =
  exports.pure =
  exports.error =
  exports.doneInvoke =
  exports.done =
  exports.after =
  exports.isActionObject =
  exports.assign =
  exports.resolveStop =
  exports.stop =
  exports.start =
  exports.cancel =
  exports.resolveLog =
  exports.log =
  exports.respond =
  exports.sendUpdate =
  exports.sendTo =
  exports.sendParent =
  exports.resolveSend =
  exports.send =
  exports.resolveRaise =
  exports.raise =
  exports.toActivityDefinition =
  exports.toActionObjects =
  exports.toActionObject =
  exports.getActionFunction =
  exports.initEvent =
  exports.actionTypes =
    void 0;
var types_1 = require("./types");
var actionTypes = require("./actionTypes");
exports.actionTypes = actionTypes;
var utils_1 = require("./utils");
var environment_1 = require("./environment");
exports.initEvent = (0, utils_1.toSCXMLEvent)({ type: actionTypes.init });
function getActionFunction(actionType, actionFunctionMap) {
  return actionFunctionMap
    ? actionFunctionMap[actionType] || undefined
    : undefined;
}
exports.getActionFunction = getActionFunction;
function toActionObject(action, actionFunctionMap) {
  var actionObject;
  if ((0, utils_1.isString)(action) || typeof action === "number") {
    var exec = getActionFunction(action, actionFunctionMap);
    if ((0, utils_1.isFunction)(exec)) {
      actionObject = {
        type: action,
        exec: exec,
      };
    } else if (exec) {
      actionObject = exec;
    } else {
      actionObject = { type: action, exec: undefined };
    }
  } else if ((0, utils_1.isFunction)(action)) {
    actionObject = {
      // Convert action to string if unnamed
      type: action.name || action.toString(),
      exec: action,
    };
  } else {
    var exec = getActionFunction(action.type, actionFunctionMap);
    if ((0, utils_1.isFunction)(exec)) {
      actionObject = __assign(__assign({}, action), { exec: exec });
    } else if (exec) {
      var actionType = exec.type || action.type;
      actionObject = __assign(__assign(__assign({}, exec), action), {
        type: actionType,
      });
    } else {
      actionObject = action;
    }
  }
  return actionObject;
}
exports.toActionObject = toActionObject;
var toActionObjects = function (action, actionFunctionMap) {
  if (!action) {
    return [];
  }
  var actions = (0, utils_1.isArray)(action) ? action : [action];
  return actions.map(function (subAction) {
    return toActionObject(subAction, actionFunctionMap);
  });
};
exports.toActionObjects = toActionObjects;
function toActivityDefinition(action) {
  var actionObject = toActionObject(action);
  return __assign(
    __assign(
      { id: (0, utils_1.isString)(action) ? action : actionObject.id },
      actionObject
    ),
    { type: actionObject.type }
  );
}
exports.toActivityDefinition = toActivityDefinition;
/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */
function raise(event) {
  if (!(0, utils_1.isString)(event)) {
    return send(event, { to: types_1.SpecialTargets.Internal });
  }
  return {
    type: actionTypes.raise,
    event: event,
  };
}
exports.raise = raise;
function resolveRaise(action) {
  return {
    type: actionTypes.raise,
    _event: (0, utils_1.toSCXMLEvent)(action.event),
  };
}
exports.resolveRaise = resolveRaise;
/**
 * Sends an event. This returns an action that will be read by an interpreter to
 * send the event in the next step, after the current step is finished executing.
 *
 * @param event The event to send.
 * @param options Options to pass into the send event:
 *  - `id` - The unique send event identifier (used with `cancel()`).
 *  - `delay` - The number of milliseconds to delay the sending of the event.
 *  - `to` - The target of this event (by default, the machine the event was sent from).
 */
function send(event, options) {
  return {
    to: options ? options.to : undefined,
    type: actionTypes.send,
    event: (0, utils_1.isFunction)(event)
      ? event
      : (0, utils_1.toEventObject)(event),
    delay: options ? options.delay : undefined,
    id:
      options && options.id !== undefined
        ? options.id
        : (0, utils_1.isFunction)(event)
        ? event.name
        : (0, utils_1.getEventType)(event),
  };
}
exports.send = send;
function resolveSend(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event,
  };
  // TODO: helper function for resolving Expr
  var resolvedEvent = (0, utils_1.toSCXMLEvent)(
    (0, utils_1.isFunction)(action.event)
      ? action.event(ctx, _event.data, meta)
      : action.event
  );
  var resolvedDelay;
  if ((0, utils_1.isString)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0, utils_1.isFunction)(configDelay)
      ? configDelay(ctx, _event.data, meta)
      : configDelay;
  } else {
    resolvedDelay = (0, utils_1.isFunction)(action.delay)
      ? action.delay(ctx, _event.data, meta)
      : action.delay;
  }
  var resolvedTarget = (0, utils_1.isFunction)(action.to)
    ? action.to(ctx, _event.data, meta)
    : action.to;
  return __assign(__assign({}, action), {
    to: resolvedTarget,
    _event: resolvedEvent,
    event: resolvedEvent.data,
    delay: resolvedDelay,
  });
}
exports.resolveSend = resolveSend;
/**
 * Sends an event to this machine's parent.
 *
 * @param event The event to send to the parent machine.
 * @param options Options to pass into the send event.
 */
function sendParent(event, options) {
  return send(
    event,
    __assign(__assign({}, options), { to: types_1.SpecialTargets.Parent })
  );
}
exports.sendParent = sendParent;
/**
 * Sends an event to an actor.
 *
 * @param actor The `ActorRef` to send the event to.
 * @param event The event to send, or an expression that evaluates to the event to send
 * @param options Send action options
 * @returns An XState send action object
 */
function sendTo(actor, event, options) {
  return send(event, __assign(__assign({}, options), { to: actor }));
}
exports.sendTo = sendTo;
/**
 * Sends an update event to this machine's parent.
 */
function sendUpdate() {
  return sendParent(actionTypes.update);
}
exports.sendUpdate = sendUpdate;
/**
 * Sends an event back to the sender of the original event.
 *
 * @param event The event to send back to the sender
 * @param options Options to pass into the send event
 */
function respond(event, options) {
  return send(
    event,
    __assign(__assign({}, options), {
      to: function (_, __, _a) {
        var _event = _a._event;
        return _event.origin; // TODO: handle when _event.origin is undefined
      },
    })
  );
}
exports.respond = respond;
var defaultLogExpr = function (context, event) {
  return {
    context: context,
    event: event,
  };
};
/**
 *
 * @param expr The expression function to evaluate which will be logged.
 *  Takes in 2 arguments:
 *  - `ctx` - the current state context
 *  - `event` - the event that caused this action to be executed.
 * @param label The label to give to the logged expression.
 */
function log(expr, label) {
  if (expr === void 0) {
    expr = defaultLogExpr;
  }
  return {
    type: actionTypes.log,
    label: label,
    expr: expr,
  };
}
exports.log = log;
var resolveLog = function (action, ctx, _event) {
  return __assign(__assign({}, action), {
    value: (0, utils_1.isString)(action.expr)
      ? action.expr
      : action.expr(ctx, _event.data, {
          _event: _event,
        }),
  });
};
exports.resolveLog = resolveLog;
/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */
var cancel = function (sendId) {
  return {
    type: actionTypes.cancel,
    sendId: sendId,
  };
};
exports.cancel = cancel;
/**
 * Starts an activity.
 *
 * @param activity The activity to start.
 */
function start(activity) {
  var activityDef = toActivityDefinition(activity);
  return {
    type: types_1.ActionTypes.Start,
    activity: activityDef,
    exec: undefined,
  };
}
exports.start = start;
/**
 * Stops an activity.
 *
 * @param actorRef The activity to stop.
 */
function stop(actorRef) {
  var activity = (0, utils_1.isFunction)(actorRef)
    ? actorRef
    : toActivityDefinition(actorRef);
  return {
    type: types_1.ActionTypes.Stop,
    activity: activity,
    exec: undefined,
  };
}
exports.stop = stop;
function resolveStop(action, context, _event) {
  var actorRefOrString = (0, utils_1.isFunction)(action.activity)
    ? action.activity(context, _event.data)
    : action.activity;
  var resolvedActorRef =
    typeof actorRefOrString === "string"
      ? { id: actorRefOrString }
      : actorRefOrString;
  var actionObject = {
    type: types_1.ActionTypes.Stop,
    activity: resolvedActorRef,
  };
  return actionObject;
}
exports.resolveStop = resolveStop;
/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */
var assign = function (assignment) {
  return {
    type: actionTypes.assign,
    assignment: assignment,
  };
};
exports.assign = assign;
function isActionObject(action) {
  return typeof action === "object" && "type" in action;
}
exports.isActionObject = isActionObject;
/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */
function after(delayRef, id) {
  var idSuffix = id ? "#".concat(id) : "";
  return ""
    .concat(types_1.ActionTypes.After, "(")
    .concat(delayRef, ")")
    .concat(idSuffix);
}
exports.after = after;
/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param data The data to pass into the event
 */
function done(id, data) {
  var type = "".concat(types_1.ActionTypes.DoneState, ".").concat(id);
  var eventObject = {
    type: type,
    data: data,
  };
  eventObject.toString = function () {
    return type;
  };
  return eventObject;
}
exports.done = done;
/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state node,
 * but not when it is canceled.
 *
 * @param id The final state node ID
 * @param data The data to pass into the event
 */
function doneInvoke(id, data) {
  var type = "".concat(types_1.ActionTypes.DoneInvoke, ".").concat(id);
  var eventObject = {
    type: type,
    data: data,
  };
  eventObject.toString = function () {
    return type;
  };
  return eventObject;
}
exports.doneInvoke = doneInvoke;
function error(id, data) {
  var type = "".concat(types_1.ActionTypes.ErrorPlatform, ".").concat(id);
  var eventObject = { type: type, data: data };
  eventObject.toString = function () {
    return type;
  };
  return eventObject;
}
exports.error = error;
function pure(getActions) {
  return {
    type: types_1.ActionTypes.Pure,
    get: getActions,
  };
}
exports.pure = pure;
/**
 * Forwards (sends) an event to a specified service.
 *
 * @param target The target service to forward the event to.
 * @param options Options to pass into the send action creator.
 */
function forwardTo(target, options) {
  if (
    !environment_1.IS_PRODUCTION &&
    (!target || typeof target === "function")
  ) {
    var originalTarget_1 = target;
    target = function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var resolvedTarget =
        typeof originalTarget_1 === "function"
          ? originalTarget_1.apply(
              void 0,
              __spreadArray([], __read(args), false)
            )
          : originalTarget_1;
      if (!resolvedTarget) {
        throw new Error(
          "Attempted to forward event to undefined actor. This risks an infinite loop in the sender."
        );
      }
      return resolvedTarget;
    };
  }
  return send(function (_, event) {
    return event;
  }, __assign(__assign({}, options), { to: target }));
}
exports.forwardTo = forwardTo;
/**
 * Escalates an error by sending it as an event to this machine's parent.
 *
 * @param errorData The error data to send, or the expression function that
 * takes in the `context`, `event`, and `meta`, and returns the error data to send.
 * @param options Options to pass into the send action creator.
 */
function escalate(errorData, options) {
  return sendParent(function (context, event, meta) {
    return {
      type: actionTypes.error,
      data: (0, utils_1.isFunction)(errorData)
        ? errorData(context, event, meta)
        : errorData,
    };
  }, __assign(__assign({}, options), { to: types_1.SpecialTargets.Parent }));
}
exports.escalate = escalate;
function choose(conds) {
  return {
    type: types_1.ActionTypes.Choose,
    conds: conds,
  };
}
exports.choose = choose;
var pluckAssigns = function (actionBlocks) {
  var e_1, _a;
  var assignActions = [];
  try {
    for (
      var actionBlocks_1 = __values(actionBlocks),
        actionBlocks_1_1 = actionBlocks_1.next();
      !actionBlocks_1_1.done;
      actionBlocks_1_1 = actionBlocks_1.next()
    ) {
      var block = actionBlocks_1_1.value;
      var i = 0;
      while (i < block.length) {
        if (block[i].type === actionTypes.assign) {
          assignActions.push(block[i]);
          block.splice(i, 1);
          continue;
        }
        i++;
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (
        actionBlocks_1_1 &&
        !actionBlocks_1_1.done &&
        (_a = actionBlocks_1.return)
      )
        _a.call(actionBlocks_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return assignActions;
};
function resolveActions(
  machine,
  currentState,
  currentContext,
  _event,
  actionBlocks,
  predictableExec,
  preserveActionOrder
) {
  if (preserveActionOrder === void 0) {
    preserveActionOrder = false;
  }
  var assignActions = preserveActionOrder ? [] : pluckAssigns(actionBlocks);
  var updatedContext = assignActions.length
    ? (0, utils_1.updateContext)(
        currentContext,
        _event,
        assignActions,
        currentState
      )
    : currentContext;
  var preservedContexts = preserveActionOrder ? [currentContext] : undefined;
  var deferredToBlockEnd = [];
  function handleAction(actionObject) {
    var _a;
    switch (actionObject.type) {
      case actionTypes.raise: {
        return resolveRaise(actionObject);
      }
      case actionTypes.send:
        var sendAction = resolveSend(
          actionObject,
          updatedContext,
          _event,
          machine.options.delays
        ); // TODO: fix ActionTypes.Init
        if (!environment_1.IS_PRODUCTION) {
          // warn after resolving as we can create better contextual message here
          (0, utils_1.warn)(
            !(0, utils_1.isString)(actionObject.delay) ||
              typeof sendAction.delay === "number",
            // tslint:disable-next-line:max-line-length
            "No delay reference for delay expression '"
              .concat(actionObject.delay, "' was found on machine '")
              .concat(machine.id, "'")
          );
        }
        if (
          predictableExec &&
          sendAction.to !== types_1.SpecialTargets.Internal
        ) {
          deferredToBlockEnd.push(sendAction);
        }
        return sendAction;
      case actionTypes.log: {
        var resolved = (0, exports.resolveLog)(
          actionObject,
          updatedContext,
          _event
        );
        predictableExec === null || predictableExec === void 0
          ? void 0
          : predictableExec(resolved, updatedContext, _event);
        return resolved;
      }
      case actionTypes.choose: {
        var chooseAction = actionObject;
        var matchedActions =
          (_a = chooseAction.conds.find(function (condition) {
            var guard = (0, utils_1.toGuard)(
              condition.cond,
              machine.options.guards
            );
            return (
              !guard ||
              (0, utils_1.evaluateGuard)(
                machine,
                guard,
                updatedContext,
                _event,
                !predictableExec ? currentState : undefined
              )
            );
          })) === null || _a === void 0
            ? void 0
            : _a.actions;
        if (!matchedActions) {
          return [];
        }
        var _b = __read(
            resolveActions(
              machine,
              currentState,
              updatedContext,
              _event,
              [
                (0, exports.toActionObjects)(
                  (0, utils_1.toArray)(matchedActions),
                  machine.options.actions
                ),
              ],
              predictableExec,
              preserveActionOrder
            ),
            2
          ),
          resolvedActionsFromChoose = _b[0],
          resolvedContextFromChoose = _b[1];
        updatedContext = resolvedContextFromChoose;
        preservedContexts === null || preservedContexts === void 0
          ? void 0
          : preservedContexts.push(updatedContext);
        return resolvedActionsFromChoose;
      }
      case actionTypes.pure: {
        var matchedActions = actionObject.get(updatedContext, _event.data);
        if (!matchedActions) {
          return [];
        }
        var _c = __read(
            resolveActions(
              machine,
              currentState,
              updatedContext,
              _event,
              [
                (0, exports.toActionObjects)(
                  (0, utils_1.toArray)(matchedActions),
                  machine.options.actions
                ),
              ],
              predictableExec,
              preserveActionOrder
            ),
            2
          ),
          resolvedActionsFromPure = _c[0],
          resolvedContext = _c[1];
        updatedContext = resolvedContext;
        preservedContexts === null || preservedContexts === void 0
          ? void 0
          : preservedContexts.push(updatedContext);
        return resolvedActionsFromPure;
      }
      case actionTypes.stop: {
        var resolved = resolveStop(actionObject, updatedContext, _event);
        predictableExec === null || predictableExec === void 0
          ? void 0
          : predictableExec(resolved, currentContext, _event);
        return resolved;
      }
      case actionTypes.assign: {
        updatedContext = (0, utils_1.updateContext)(
          updatedContext,
          _event,
          [actionObject],
          !predictableExec ? currentState : undefined
        );
        preservedContexts === null || preservedContexts === void 0
          ? void 0
          : preservedContexts.push(updatedContext);
        break;
      }
      default:
        var resolvedActionObject = toActionObject(
          actionObject,
          machine.options.actions
        );
        var exec_1 = resolvedActionObject.exec;
        if (predictableExec) {
          predictableExec(resolvedActionObject, updatedContext, _event);
        } else if (exec_1 && preservedContexts) {
          var contextIndex_1 = preservedContexts.length - 1;
          resolvedActionObject = __assign(__assign({}, resolvedActionObject), {
            exec: function (_ctx) {
              var args = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
              }
              exec_1.apply(
                void 0,
                __spreadArray(
                  [preservedContexts[contextIndex_1]],
                  __read(args),
                  false
                )
              );
            },
          });
        }
        return resolvedActionObject;
    }
  }
  function processBlock(block) {
    var e_2, _a;
    var resolvedActions = [];
    try {
      for (
        var block_1 = __values(block), block_1_1 = block_1.next();
        !block_1_1.done;
        block_1_1 = block_1.next()
      ) {
        var action = block_1_1.value;
        var resolved = handleAction(action);
        if (resolved) {
          resolvedActions = resolvedActions.concat(resolved);
        }
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (block_1_1 && !block_1_1.done && (_a = block_1.return))
          _a.call(block_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    deferredToBlockEnd.forEach(function (action) {
      predictableExec(action, updatedContext, _event);
    });
    deferredToBlockEnd.length = 0;
    return resolvedActions;
  }
  var resolvedActions = (0, utils_1.flatten)(actionBlocks.map(processBlock));
  return [resolvedActions, updatedContext];
}
exports.resolveActions = resolveActions;
