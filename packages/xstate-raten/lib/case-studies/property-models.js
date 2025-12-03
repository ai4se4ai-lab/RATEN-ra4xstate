"use strict";
/**
 * Property State Machines (PSM) for RATEN Evaluation
 *
 * Property models specify expected system behavior and robustness requirements.
 * Each model contains Good states (acceptable) and Bad states (robustness violations)
 * with associated cost values for transitions.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyModel =
  exports.propertyModelsMetadata =
  exports.refinedFailoverSystemPSM =
  exports.refinedRoverControlPSM =
  exports.refinedParcelRouterPSM =
  exports.refinedContentManagementPSM =
  exports.failoverSystemPSM =
  exports.roverControlPSM =
  exports.parcelRouterPSM =
  exports.contentManagementPSM =
    void 0;
var xstate_1 = require("xstate");
/**
 * Cost action helper - creates an action that sets cost value
 */
function setCost(value) {
  return (0, xstate_1.assign)({
    cost: function () {
      return value;
    },
  });
}
/**
 * CM Property Model - Content Management
 * Specifies acceptable document lifecycle states
 */
exports.contentManagementPSM = (0, xstate_1.createMachine)({
  id: "cmProperty",
  initial: "good_idle",
  context: {
    cost: 0,
    violationCount: 0,
  },
  states: {
    // Good states - acceptable system behavior
    good_idle: {
      tags: ["Good"],
      on: {
        EDIT: {
          target: "good_editing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        SUBMIT: {
          target: "good_reviewing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        DELETE: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        // Wrong message transitions to bad state
        INVALID_ACTION: {
          target: "bad_unexpected_action",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
        WRONG_PAYLOAD: {
          target: "bad_invalid_data",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 8;
            },
          }),
        },
      },
    },
    good_editing: {
      tags: ["Good"],
      on: {
        SAVE: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        CANCEL: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        TIMEOUT: {
          target: "bad_timeout",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 5;
            },
          }),
        },
        INVALID_ACTION: {
          target: "bad_unexpected_action",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
      },
    },
    good_reviewing: {
      tags: ["Good"],
      on: {
        APPROVE: {
          target: "good_published",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        REJECT: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        MISSING_REVIEW: {
          target: "bad_missing_message",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 7;
            },
          }),
        },
      },
    },
    good_published: {
      tags: ["Good"],
      on: {
        UNPUBLISH: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        ARCHIVE: {
          target: "good_archived",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        INVALID_ACTION: {
          target: "bad_unexpected_action",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
      },
    },
    good_archived: {
      tags: ["Good"],
      on: {
        RESTORE: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
      },
    },
    // Bad states - robustness violations
    bad_unexpected_action: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
        CONTINUE: {
          target: "bad_degraded",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 3;
            },
          }),
        },
      },
    },
    bad_invalid_data: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
        CONTINUE: {
          target: "bad_degraded",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 4;
            },
          }),
        },
      },
    },
    bad_timeout: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -3;
            },
          }),
        },
        RETRY: {
          target: "good_editing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -2;
            },
          }),
        },
      },
    },
    bad_missing_message: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
        RESEND: {
          target: "good_reviewing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -3;
            },
          }),
        },
      },
    },
    bad_degraded: {
      tags: ["Bad"],
      on: {
        FULL_RECOVERY: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -8;
            },
          }),
        },
      },
    },
  },
});
/**
 * PR Property Model - Parcel Router
 * Specifies acceptable routing states and delivery requirements
 */
exports.parcelRouterPSM = (0, xstate_1.createMachine)({
  id: "prProperty",
  initial: "good_ready",
  context: {
    cost: 0,
    violationCount: 0,
  },
  states: {
    good_ready: {
      tags: ["Good"],
      on: {
        RECEIVE: {
          target: "good_processing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        WRONG_MESSAGE: {
          target: "bad_wrong_input",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 12;
            },
          }),
        },
      },
    },
    good_processing: {
      tags: ["Good"],
      on: {
        VALID: {
          target: "good_routing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        INVALID: {
          target: "bad_validation_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 8;
            },
          }),
        },
        TIMEOUT: {
          target: "bad_processing_timeout",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 6;
            },
          }),
        },
      },
    },
    good_routing: {
      tags: ["Good"],
      on: {
        ROUTE_ASSIGNED: {
          target: "good_in_transit",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        ROUTE_ERROR: {
          target: "bad_routing_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
        WRONG_PAYLOAD: {
          target: "bad_invalid_route",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 9;
            },
          }),
        },
      },
    },
    good_in_transit: {
      tags: ["Good"],
      on: {
        ARRIVED: {
          target: "good_at_destination",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        DELAY: {
          target: "good_delayed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 2;
            },
          }),
        },
        LOST: {
          target: "bad_parcel_lost",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 20;
            },
          }),
        },
        MISSING_UPDATE: {
          target: "bad_no_tracking",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 7;
            },
          }),
        },
      },
    },
    good_delayed: {
      tags: ["Good"],
      on: {
        RESUME: {
          target: "good_in_transit",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        CANCEL: {
          target: "good_returned",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        EXCESSIVE_DELAY: {
          target: "bad_delivery_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 15;
            },
          }),
        },
      },
    },
    good_at_destination: {
      tags: ["Good"],
      on: {
        DELIVER: {
          target: "good_delivered",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        DELIVERY_FAIL: {
          target: "bad_delivery_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 12;
            },
          }),
        },
      },
    },
    good_delivered: {
      tags: ["Good"],
      type: "final",
    },
    good_returned: {
      tags: ["Good"],
      on: {
        COMPLETE: {
          target: "good_ready",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
      },
    },
    // Bad states
    bad_wrong_input: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_ready",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -6;
            },
          }),
        },
      },
    },
    bad_validation_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_processing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
        REJECT: {
          target: "good_returned",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
      },
    },
    bad_routing_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_routing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
        MANUAL: {
          target: "good_routing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -3;
            },
          }),
        },
      },
    },
    bad_invalid_route: {
      tags: ["Bad"],
      on: {
        CORRECT: {
          target: "good_routing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
      },
    },
    bad_parcel_lost: {
      tags: ["Bad"],
      on: {
        FOUND: {
          target: "good_in_transit",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -10;
            },
          }),
        },
        CLAIM: {
          target: "good_ready",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -8;
            },
          }),
        },
      },
    },
    bad_no_tracking: {
      tags: ["Bad"],
      on: {
        UPDATE_RECEIVED: {
          target: "good_in_transit",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
      },
    },
    bad_delivery_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_at_destination",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -6;
            },
          }),
        },
        RETURN: {
          target: "good_returned",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
      },
    },
    bad_processing_timeout: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_processing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -3;
            },
          }),
        },
      },
    },
  },
});
/**
 * RO Property Model - Rover Control
 * Specifies acceptable rover operational states
 */
exports.roverControlPSM = (0, xstate_1.createMachine)({
  id: "roProperty",
  initial: "good_standby",
  context: {
    cost: 0,
    violationCount: 0,
  },
  states: {
    good_standby: {
      tags: ["Good"],
      on: {
        POWER_ON: {
          target: "good_initializing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        WRONG_COMMAND: {
          target: "bad_invalid_command",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 8;
            },
          }),
        },
      },
    },
    good_initializing: {
      tags: ["Good"],
      on: {
        INIT_OK: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        INIT_FAIL: {
          target: "bad_init_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 12;
            },
          }),
        },
        TIMEOUT: {
          target: "bad_init_timeout",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
      },
    },
    good_idle: {
      tags: ["Good"],
      on: {
        START_TASK: {
          target: "good_planning",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        MANUAL: {
          target: "good_manual",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        SHUTDOWN: {
          target: "good_standby",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        WRONG_COMMAND: {
          target: "bad_invalid_command",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 8;
            },
          }),
        },
        BAD_SENSOR: {
          target: "bad_sensor_error",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 15;
            },
          }),
        },
      },
    },
    good_planning: {
      tags: ["Good"],
      on: {
        PLAN_OK: {
          target: "good_navigating",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        PLAN_FAIL: {
          target: "bad_planning_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 7;
            },
          }),
        },
      },
    },
    good_navigating: {
      tags: ["Good"],
      on: {
        ARRIVED: {
          target: "good_executing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        OBSTACLE: {
          target: "good_avoiding",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 1;
            },
          }),
        },
        LOW_BATTERY: {
          target: "good_returning",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 2;
            },
          }),
        },
        COLLISION: {
          target: "bad_collision",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 25;
            },
          }),
        },
        NAV_ERROR: {
          target: "bad_navigation_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
        WRONG_POSITION: {
          target: "bad_position_error",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 12;
            },
          }),
        },
      },
    },
    good_avoiding: {
      tags: ["Good"],
      on: {
        CLEAR: {
          target: "good_navigating",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        STUCK: {
          target: "bad_stuck",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 15;
            },
          }),
        },
      },
    },
    good_executing: {
      tags: ["Good"],
      on: {
        TASK_DONE: {
          target: "good_task_complete",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        TASK_FAIL: {
          target: "bad_task_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 8;
            },
          }),
        },
        WRONG_PAYLOAD: {
          target: "bad_task_error",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
      },
    },
    good_task_complete: {
      tags: ["Good"],
      on: {
        NEW_TASK: {
          target: "good_planning",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        RETURN: {
          target: "good_returning",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        IDLE: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
      },
    },
    good_returning: {
      tags: ["Good"],
      on: {
        BASE_REACHED: {
          target: "good_at_base",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        LOST: {
          target: "bad_lost",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 20;
            },
          }),
        },
      },
    },
    good_at_base: {
      tags: ["Good"],
      on: {
        CHARGE: {
          target: "good_charging",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        IDLE: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
      },
    },
    good_charging: {
      tags: ["Good"],
      on: {
        CHARGED: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        CHARGE_FAIL: {
          target: "bad_charge_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
      },
    },
    good_manual: {
      tags: ["Good"],
      on: {
        EXIT: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        WRONG_COMMAND: {
          target: "bad_manual_error",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 6;
            },
          }),
        },
      },
    },
    // Bad states
    bad_invalid_command: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
      },
    },
    bad_init_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_initializing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -6;
            },
          }),
        },
      },
    },
    bad_init_timeout: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_initializing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
      },
    },
    bad_sensor_error: {
      tags: ["Bad"],
      on: {
        CALIBRATE: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -8;
            },
          }),
        },
      },
    },
    bad_planning_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_planning",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
        ABORT: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -3;
            },
          }),
        },
      },
    },
    bad_collision: {
      tags: ["Bad"],
      on: {
        ASSESS: {
          target: "bad_damage_assessment",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 5;
            },
          }),
        },
        EMERGENCY_STOP: {
          target: "good_standby",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -10;
            },
          }),
        },
      },
    },
    bad_damage_assessment: {
      tags: ["Bad"],
      on: {
        OK: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -15;
            },
          }),
        },
        DAMAGED: {
          target: "good_standby",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -12;
            },
          }),
        },
      },
    },
    bad_navigation_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_navigating",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
        ABORT: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
      },
    },
    bad_position_error: {
      tags: ["Bad"],
      on: {
        RECALIBRATE: {
          target: "good_navigating",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -6;
            },
          }),
        },
      },
    },
    bad_stuck: {
      tags: ["Bad"],
      on: {
        MANUAL_HELP: {
          target: "good_manual",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -8;
            },
          }),
        },
        AUTO_RECOVER: {
          target: "good_navigating",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -7;
            },
          }),
        },
      },
    },
    bad_task_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_executing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
        ABORT: {
          target: "good_idle",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -3;
            },
          }),
        },
      },
    },
    bad_task_error: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_executing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
      },
    },
    bad_lost: {
      tags: ["Bad"],
      on: {
        LOCATE: {
          target: "good_returning",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -10;
            },
          }),
        },
        MANUAL_HELP: {
          target: "good_manual",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -8;
            },
          }),
        },
      },
    },
    bad_charge_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_charging",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
        MANUAL: {
          target: "good_standby",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
      },
    },
    bad_manual_error: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_manual",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -3;
            },
          }),
        },
      },
    },
  },
});
/**
 * FO Property Model - FailOver System
 * Specifies acceptable failover states and recovery requirements
 */
exports.failoverSystemPSM = (0, xstate_1.createMachine)({
  id: "foProperty",
  initial: "good_standby",
  context: {
    cost: 0,
    violationCount: 0,
  },
  states: {
    good_standby: {
      tags: ["Good"],
      on: {
        POWER_ON: {
          target: "good_initializing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        WRONG_COMMAND: {
          target: "bad_invalid_command",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
      },
    },
    good_initializing: {
      tags: ["Good"],
      on: {
        INIT_OK: {
          target: "good_primary_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        INIT_FAIL: {
          target: "bad_init_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 15;
            },
          }),
        },
        TIMEOUT: {
          target: "bad_init_timeout",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 12;
            },
          }),
        },
      },
    },
    good_primary_active: {
      tags: ["Good"],
      on: {
        HEALTH_OK: {
          target: "good_primary_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        DEGRADED: {
          target: "good_primary_degraded",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 3;
            },
          }),
        },
        FAILED: {
          target: "bad_primary_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 20;
            },
          }),
        },
        SYNC: {
          target: "good_syncing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        SHUTDOWN: {
          target: "good_standby",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        WRONG_STATUS: {
          target: "bad_status_error",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 8;
            },
          }),
        },
        MISSING_HEARTBEAT: {
          target: "bad_no_heartbeat",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 12;
            },
          }),
        },
      },
    },
    good_primary_degraded: {
      tags: ["Good"],
      on: {
        RECOVERED: {
          target: "good_primary_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -2;
            },
          }),
        },
        WORSENED: {
          target: "bad_primary_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 18;
            },
          }),
        },
        FAILOVER: {
          target: "good_failover_in_progress",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 5;
            },
          }),
        },
      },
    },
    good_syncing: {
      tags: ["Good"],
      on: {
        SYNC_OK: {
          target: "good_primary_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        SYNC_FAIL: {
          target: "bad_sync_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 10;
            },
          }),
        },
      },
    },
    good_failover_in_progress: {
      tags: ["Good"],
      on: {
        BACKUP_ACTIVE: {
          target: "good_backup_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        FAILOVER_FAIL: {
          target: "bad_failover_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 25;
            },
          }),
        },
      },
    },
    good_backup_active: {
      tags: ["Good"],
      on: {
        HEALTH_OK: {
          target: "good_backup_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        DEGRADED: {
          target: "good_backup_degraded",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 3;
            },
          }),
        },
        FAILED: {
          target: "bad_backup_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 30;
            },
          }),
        },
        FAILBACK: {
          target: "good_failback_in_progress",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        MISSING_HEARTBEAT: {
          target: "bad_no_heartbeat",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 12;
            },
          }),
        },
      },
    },
    good_backup_degraded: {
      tags: ["Good"],
      on: {
        RECOVERED: {
          target: "good_backup_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -2;
            },
          }),
        },
        FAILBACK: {
          target: "good_failback_in_progress",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        WORSENED: {
          target: "bad_backup_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 28;
            },
          }),
        },
      },
    },
    good_failback_in_progress: {
      tags: ["Good"],
      on: {
        FAILBACK_OK: {
          target: "good_primary_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 0;
            },
          }),
        },
        FAILBACK_FAIL: {
          target: "bad_failback_failed",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return 15;
            },
          }),
        },
      },
    },
    // Bad states
    bad_invalid_command: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_standby",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
      },
    },
    bad_init_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_initializing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -8;
            },
          }),
        },
      },
    },
    bad_init_timeout: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_initializing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -6;
            },
          }),
        },
      },
    },
    bad_primary_failed: {
      tags: ["Bad"],
      on: {
        FAILOVER: {
          target: "good_failover_in_progress",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -10;
            },
          }),
        },
        RECOVER: {
          target: "good_primary_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -12;
            },
          }),
        },
      },
    },
    bad_status_error: {
      tags: ["Bad"],
      on: {
        CORRECT: {
          target: "good_primary_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
      },
    },
    bad_no_heartbeat: {
      tags: ["Bad"],
      on: {
        HEARTBEAT_RECEIVED: {
          target: "good_primary_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -6;
            },
          }),
        },
        FAILOVER: {
          target: "good_failover_in_progress",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -4;
            },
          }),
        },
      },
    },
    bad_sync_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_syncing",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
        CONTINUE: {
          target: "good_primary_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -3;
            },
          }),
        },
      },
    },
    bad_failover_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_failover_in_progress",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -12;
            },
          }),
        },
        EMERGENCY: {
          target: "good_standby",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -8;
            },
          }),
        },
      },
    },
    bad_backup_failed: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_backup_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -15;
            },
          }),
        },
        EMERGENCY: {
          target: "good_standby",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -10;
            },
          }),
        },
      },
    },
    bad_failback_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_failback_in_progress",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -8;
            },
          }),
        },
        CONTINUE_BACKUP: {
          target: "good_backup_active",
          actions: (0, xstate_1.assign)({
            cost: function () {
              return -5;
            },
          }),
        },
      },
    },
  },
});
/**
 * Generate property model for instrumented models
 * These have more states to match the instrumented BSMs
 */
function generateInstrumentedPSM(id, basePSM) {
  var baseConfig = basePSM.config;
  var states = __assign({}, baseConfig.states);
  // Add additional monitoring and debug states
  Object.keys(baseConfig.states).forEach(function (stateName) {
    if (!stateName.startsWith("bad_")) {
      // Add monitoring variant
      states["".concat(stateName, "_mon")] = {
        tags: ["Good"],
        on: {
          MON_OK: {
            target: stateName,
            actions: (0, xstate_1.assign)({
              cost: function () {
                return 0;
              },
            }),
          },
          MON_ALERT: {
            target: "bad_mon_alert",
            actions: (0, xstate_1.assign)({
              cost: function () {
                return 5;
              },
            }),
          },
        },
      };
    }
  });
  // Add generic monitoring bad state
  states["bad_mon_alert"] = {
    tags: ["Bad"],
    on: {
      RESOLVE: {
        target: baseConfig.initial,
        actions: (0, xstate_1.assign)({
          cost: function () {
            return -3;
          },
        }),
      },
    },
  };
  return (0, xstate_1.createMachine)({
    id: id,
    initial: baseConfig.initial,
    context: baseConfig.context,
    states: states,
  });
}
// Instrumented property models
exports.refinedContentManagementPSM = generateInstrumentedPSM(
  "rcmProperty",
  exports.contentManagementPSM
);
exports.refinedParcelRouterPSM = generateInstrumentedPSM(
  "rprProperty",
  exports.parcelRouterPSM
);
exports.refinedRoverControlPSM = generateInstrumentedPSM(
  "rroProperty",
  exports.roverControlPSM
);
exports.refinedFailoverSystemPSM = generateInstrumentedPSM(
  "rfoProperty",
  exports.failoverSystemPSM
);
// Export property model metadata
exports.propertyModelsMetadata = {
  CM: { name: "CM Property", machine: exports.contentManagementPSM },
  PR: { name: "PR Property", machine: exports.parcelRouterPSM },
  RO: { name: "RO Property", machine: exports.roverControlPSM },
  FO: { name: "FO Property", machine: exports.failoverSystemPSM },
  RCM: { name: "RCM Property", machine: exports.refinedContentManagementPSM },
  RPR: { name: "RPR Property", machine: exports.refinedParcelRouterPSM },
  RRO: { name: "RRO Property", machine: exports.refinedRoverControlPSM },
  RFO: { name: "RFO Property", machine: exports.refinedFailoverSystemPSM },
};
/**
 * Get property model for a given case study
 */
function getPropertyModel(key) {
  return exports.propertyModelsMetadata[key];
}
exports.getPropertyModel = getPropertyModel;
