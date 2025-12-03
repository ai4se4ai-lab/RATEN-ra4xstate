/**
 * Property State Machines (PSM) for RATEN Evaluation
 *
 * Property models specify expected system behavior and robustness requirements.
 * Each model contains Good states (acceptable) and Bad states (robustness violations)
 * with associated cost values for transitions.
 */

import { createMachine, assign } from "xstate";

/**
 * Cost action helper - creates an action that sets cost value
 */
function setCost(value: number) {
  return assign({ cost: () => value });
}

/**
 * CM Property Model - Content Management
 * Specifies acceptable document lifecycle states
 */
export const contentManagementPSM = createMachine({
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
        EDIT: { target: "good_editing", actions: assign({ cost: () => 0 }) },
        SUBMIT: {
          target: "good_reviewing",
          actions: assign({ cost: () => 0 }),
        },
        DELETE: { target: "good_idle", actions: assign({ cost: () => 0 }) },
        // Wrong message transitions to bad state
        INVALID_ACTION: {
          target: "bad_unexpected_action",
          actions: assign({ cost: () => 10 }),
        },
        WRONG_PAYLOAD: {
          target: "bad_invalid_data",
          actions: assign({ cost: () => 8 }),
        },
      },
    },
    good_editing: {
      tags: ["Good"],
      on: {
        SAVE: { target: "good_idle", actions: assign({ cost: () => 0 }) },
        CANCEL: { target: "good_idle", actions: assign({ cost: () => 0 }) },
        TIMEOUT: { target: "bad_timeout", actions: assign({ cost: () => 5 }) },
        INVALID_ACTION: {
          target: "bad_unexpected_action",
          actions: assign({ cost: () => 10 }),
        },
      },
    },
    good_reviewing: {
      tags: ["Good"],
      on: {
        APPROVE: {
          target: "good_published",
          actions: assign({ cost: () => 0 }),
        },
        REJECT: { target: "good_idle", actions: assign({ cost: () => 0 }) },
        MISSING_REVIEW: {
          target: "bad_missing_message",
          actions: assign({ cost: () => 7 }),
        },
      },
    },
    good_published: {
      tags: ["Good"],
      on: {
        UNPUBLISH: { target: "good_idle", actions: assign({ cost: () => 0 }) },
        ARCHIVE: {
          target: "good_archived",
          actions: assign({ cost: () => 0 }),
        },
        INVALID_ACTION: {
          target: "bad_unexpected_action",
          actions: assign({ cost: () => 10 }),
        },
      },
    },
    good_archived: {
      tags: ["Good"],
      on: {
        RESTORE: { target: "good_idle", actions: assign({ cost: () => 0 }) },
      },
    },
    // Bad states - robustness violations
    bad_unexpected_action: {
      tags: ["Bad"],
      on: {
        RECOVER: { target: "good_idle", actions: assign({ cost: () => -5 }) },
        CONTINUE: {
          target: "bad_degraded",
          actions: assign({ cost: () => 3 }),
        },
      },
    },
    bad_invalid_data: {
      tags: ["Bad"],
      on: {
        RECOVER: { target: "good_idle", actions: assign({ cost: () => -4 }) },
        CONTINUE: {
          target: "bad_degraded",
          actions: assign({ cost: () => 4 }),
        },
      },
    },
    bad_timeout: {
      tags: ["Bad"],
      on: {
        RECOVER: { target: "good_idle", actions: assign({ cost: () => -3 }) },
        RETRY: { target: "good_editing", actions: assign({ cost: () => -2 }) },
      },
    },
    bad_missing_message: {
      tags: ["Bad"],
      on: {
        RECOVER: { target: "good_idle", actions: assign({ cost: () => -4 }) },
        RESEND: {
          target: "good_reviewing",
          actions: assign({ cost: () => -3 }),
        },
      },
    },
    bad_degraded: {
      tags: ["Bad"],
      on: {
        FULL_RECOVERY: {
          target: "good_idle",
          actions: assign({ cost: () => -8 }),
        },
      },
    },
  },
});

/**
 * PR Property Model - Parcel Router
 * Specifies acceptable routing states and delivery requirements
 */
export const parcelRouterPSM = createMachine({
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
          actions: assign({ cost: () => 0 }),
        },
        WRONG_MESSAGE: {
          target: "bad_wrong_input",
          actions: assign({ cost: () => 12 }),
        },
      },
    },
    good_processing: {
      tags: ["Good"],
      on: {
        VALID: { target: "good_routing", actions: assign({ cost: () => 0 }) },
        INVALID: {
          target: "bad_validation_failed",
          actions: assign({ cost: () => 8 }),
        },
        TIMEOUT: {
          target: "bad_processing_timeout",
          actions: assign({ cost: () => 6 }),
        },
      },
    },
    good_routing: {
      tags: ["Good"],
      on: {
        ROUTE_ASSIGNED: {
          target: "good_in_transit",
          actions: assign({ cost: () => 0 }),
        },
        ROUTE_ERROR: {
          target: "bad_routing_failed",
          actions: assign({ cost: () => 10 }),
        },
        WRONG_PAYLOAD: {
          target: "bad_invalid_route",
          actions: assign({ cost: () => 9 }),
        },
      },
    },
    good_in_transit: {
      tags: ["Good"],
      on: {
        ARRIVED: {
          target: "good_at_destination",
          actions: assign({ cost: () => 0 }),
        },
        DELAY: { target: "good_delayed", actions: assign({ cost: () => 2 }) },
        LOST: {
          target: "bad_parcel_lost",
          actions: assign({ cost: () => 20 }),
        },
        MISSING_UPDATE: {
          target: "bad_no_tracking",
          actions: assign({ cost: () => 7 }),
        },
      },
    },
    good_delayed: {
      tags: ["Good"],
      on: {
        RESUME: {
          target: "good_in_transit",
          actions: assign({ cost: () => 0 }),
        },
        CANCEL: { target: "good_returned", actions: assign({ cost: () => 0 }) },
        EXCESSIVE_DELAY: {
          target: "bad_delivery_failed",
          actions: assign({ cost: () => 15 }),
        },
      },
    },
    good_at_destination: {
      tags: ["Good"],
      on: {
        DELIVER: {
          target: "good_delivered",
          actions: assign({ cost: () => 0 }),
        },
        DELIVERY_FAIL: {
          target: "bad_delivery_failed",
          actions: assign({ cost: () => 12 }),
        },
      },
    },
    good_delivered: {
      tags: ["Good"],
      type: "final" as const,
    },
    good_returned: {
      tags: ["Good"],
      on: {
        COMPLETE: { target: "good_ready", actions: assign({ cost: () => 0 }) },
      },
    },
    // Bad states
    bad_wrong_input: {
      tags: ["Bad"],
      on: {
        RECOVER: { target: "good_ready", actions: assign({ cost: () => -6 }) },
      },
    },
    bad_validation_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_processing",
          actions: assign({ cost: () => -4 }),
        },
        REJECT: {
          target: "good_returned",
          actions: assign({ cost: () => -5 }),
        },
      },
    },
    bad_routing_failed: {
      tags: ["Bad"],
      on: {
        RETRY: { target: "good_routing", actions: assign({ cost: () => -5 }) },
        MANUAL: { target: "good_routing", actions: assign({ cost: () => -3 }) },
      },
    },
    bad_invalid_route: {
      tags: ["Bad"],
      on: {
        CORRECT: {
          target: "good_routing",
          actions: assign({ cost: () => -5 }),
        },
      },
    },
    bad_parcel_lost: {
      tags: ["Bad"],
      on: {
        FOUND: {
          target: "good_in_transit",
          actions: assign({ cost: () => -10 }),
        },
        CLAIM: { target: "good_ready", actions: assign({ cost: () => -8 }) },
      },
    },
    bad_no_tracking: {
      tags: ["Bad"],
      on: {
        UPDATE_RECEIVED: {
          target: "good_in_transit",
          actions: assign({ cost: () => -4 }),
        },
      },
    },
    bad_delivery_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_at_destination",
          actions: assign({ cost: () => -6 }),
        },
        RETURN: {
          target: "good_returned",
          actions: assign({ cost: () => -5 }),
        },
      },
    },
    bad_processing_timeout: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_processing",
          actions: assign({ cost: () => -3 }),
        },
      },
    },
  },
});

/**
 * RO Property Model - Rover Control
 * Specifies acceptable rover operational states
 */
export const roverControlPSM = createMachine({
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
          actions: assign({ cost: () => 0 }),
        },
        WRONG_COMMAND: {
          target: "bad_invalid_command",
          actions: assign({ cost: () => 8 }),
        },
      },
    },
    good_initializing: {
      tags: ["Good"],
      on: {
        INIT_OK: { target: "good_idle", actions: assign({ cost: () => 0 }) },
        INIT_FAIL: {
          target: "bad_init_failed",
          actions: assign({ cost: () => 12 }),
        },
        TIMEOUT: {
          target: "bad_init_timeout",
          actions: assign({ cost: () => 10 }),
        },
      },
    },
    good_idle: {
      tags: ["Good"],
      on: {
        START_TASK: {
          target: "good_planning",
          actions: assign({ cost: () => 0 }),
        },
        MANUAL: { target: "good_manual", actions: assign({ cost: () => 0 }) },
        SHUTDOWN: {
          target: "good_standby",
          actions: assign({ cost: () => 0 }),
        },
        WRONG_COMMAND: {
          target: "bad_invalid_command",
          actions: assign({ cost: () => 8 }),
        },
        BAD_SENSOR: {
          target: "bad_sensor_error",
          actions: assign({ cost: () => 15 }),
        },
      },
    },
    good_planning: {
      tags: ["Good"],
      on: {
        PLAN_OK: {
          target: "good_navigating",
          actions: assign({ cost: () => 0 }),
        },
        PLAN_FAIL: {
          target: "bad_planning_failed",
          actions: assign({ cost: () => 7 }),
        },
      },
    },
    good_navigating: {
      tags: ["Good"],
      on: {
        ARRIVED: {
          target: "good_executing",
          actions: assign({ cost: () => 0 }),
        },
        OBSTACLE: {
          target: "good_avoiding",
          actions: assign({ cost: () => 1 }),
        },
        LOW_BATTERY: {
          target: "good_returning",
          actions: assign({ cost: () => 2 }),
        },
        COLLISION: {
          target: "bad_collision",
          actions: assign({ cost: () => 25 }),
        },
        NAV_ERROR: {
          target: "bad_navigation_failed",
          actions: assign({ cost: () => 10 }),
        },
        WRONG_POSITION: {
          target: "bad_position_error",
          actions: assign({ cost: () => 12 }),
        },
      },
    },
    good_avoiding: {
      tags: ["Good"],
      on: {
        CLEAR: {
          target: "good_navigating",
          actions: assign({ cost: () => 0 }),
        },
        STUCK: { target: "bad_stuck", actions: assign({ cost: () => 15 }) },
      },
    },
    good_executing: {
      tags: ["Good"],
      on: {
        TASK_DONE: {
          target: "good_task_complete",
          actions: assign({ cost: () => 0 }),
        },
        TASK_FAIL: {
          target: "bad_task_failed",
          actions: assign({ cost: () => 8 }),
        },
        WRONG_PAYLOAD: {
          target: "bad_task_error",
          actions: assign({ cost: () => 10 }),
        },
      },
    },
    good_task_complete: {
      tags: ["Good"],
      on: {
        NEW_TASK: {
          target: "good_planning",
          actions: assign({ cost: () => 0 }),
        },
        RETURN: {
          target: "good_returning",
          actions: assign({ cost: () => 0 }),
        },
        IDLE: { target: "good_idle", actions: assign({ cost: () => 0 }) },
      },
    },
    good_returning: {
      tags: ["Good"],
      on: {
        BASE_REACHED: {
          target: "good_at_base",
          actions: assign({ cost: () => 0 }),
        },
        LOST: { target: "bad_lost", actions: assign({ cost: () => 20 }) },
      },
    },
    good_at_base: {
      tags: ["Good"],
      on: {
        CHARGE: { target: "good_charging", actions: assign({ cost: () => 0 }) },
        IDLE: { target: "good_idle", actions: assign({ cost: () => 0 }) },
      },
    },
    good_charging: {
      tags: ["Good"],
      on: {
        CHARGED: { target: "good_idle", actions: assign({ cost: () => 0 }) },
        CHARGE_FAIL: {
          target: "bad_charge_failed",
          actions: assign({ cost: () => 10 }),
        },
      },
    },
    good_manual: {
      tags: ["Good"],
      on: {
        EXIT: { target: "good_idle", actions: assign({ cost: () => 0 }) },
        WRONG_COMMAND: {
          target: "bad_manual_error",
          actions: assign({ cost: () => 6 }),
        },
      },
    },
    // Bad states
    bad_invalid_command: {
      tags: ["Bad"],
      on: {
        RECOVER: { target: "good_idle", actions: assign({ cost: () => -4 }) },
      },
    },
    bad_init_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_initializing",
          actions: assign({ cost: () => -6 }),
        },
      },
    },
    bad_init_timeout: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_initializing",
          actions: assign({ cost: () => -5 }),
        },
      },
    },
    bad_sensor_error: {
      tags: ["Bad"],
      on: {
        CALIBRATE: { target: "good_idle", actions: assign({ cost: () => -8 }) },
      },
    },
    bad_planning_failed: {
      tags: ["Bad"],
      on: {
        RETRY: { target: "good_planning", actions: assign({ cost: () => -4 }) },
        ABORT: { target: "good_idle", actions: assign({ cost: () => -3 }) },
      },
    },
    bad_collision: {
      tags: ["Bad"],
      on: {
        ASSESS: {
          target: "bad_damage_assessment",
          actions: assign({ cost: () => 5 }),
        },
        EMERGENCY_STOP: {
          target: "good_standby",
          actions: assign({ cost: () => -10 }),
        },
      },
    },
    bad_damage_assessment: {
      tags: ["Bad"],
      on: {
        OK: { target: "good_idle", actions: assign({ cost: () => -15 }) },
        DAMAGED: {
          target: "good_standby",
          actions: assign({ cost: () => -12 }),
        },
      },
    },
    bad_navigation_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_navigating",
          actions: assign({ cost: () => -5 }),
        },
        ABORT: { target: "good_idle", actions: assign({ cost: () => -4 }) },
      },
    },
    bad_position_error: {
      tags: ["Bad"],
      on: {
        RECALIBRATE: {
          target: "good_navigating",
          actions: assign({ cost: () => -6 }),
        },
      },
    },
    bad_stuck: {
      tags: ["Bad"],
      on: {
        MANUAL_HELP: {
          target: "good_manual",
          actions: assign({ cost: () => -8 }),
        },
        AUTO_RECOVER: {
          target: "good_navigating",
          actions: assign({ cost: () => -7 }),
        },
      },
    },
    bad_task_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_executing",
          actions: assign({ cost: () => -4 }),
        },
        ABORT: { target: "good_idle", actions: assign({ cost: () => -3 }) },
      },
    },
    bad_task_error: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_executing",
          actions: assign({ cost: () => -5 }),
        },
      },
    },
    bad_lost: {
      tags: ["Bad"],
      on: {
        LOCATE: {
          target: "good_returning",
          actions: assign({ cost: () => -10 }),
        },
        MANUAL_HELP: {
          target: "good_manual",
          actions: assign({ cost: () => -8 }),
        },
      },
    },
    bad_charge_failed: {
      tags: ["Bad"],
      on: {
        RETRY: { target: "good_charging", actions: assign({ cost: () => -5 }) },
        MANUAL: { target: "good_standby", actions: assign({ cost: () => -4 }) },
      },
    },
    bad_manual_error: {
      tags: ["Bad"],
      on: {
        RECOVER: { target: "good_manual", actions: assign({ cost: () => -3 }) },
      },
    },
  },
});

/**
 * FO Property Model - FailOver System
 * Specifies acceptable failover states and recovery requirements
 */
export const failoverSystemPSM = createMachine({
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
          actions: assign({ cost: () => 0 }),
        },
        WRONG_COMMAND: {
          target: "bad_invalid_command",
          actions: assign({ cost: () => 10 }),
        },
      },
    },
    good_initializing: {
      tags: ["Good"],
      on: {
        INIT_OK: {
          target: "good_primary_active",
          actions: assign({ cost: () => 0 }),
        },
        INIT_FAIL: {
          target: "bad_init_failed",
          actions: assign({ cost: () => 15 }),
        },
        TIMEOUT: {
          target: "bad_init_timeout",
          actions: assign({ cost: () => 12 }),
        },
      },
    },
    good_primary_active: {
      tags: ["Good"],
      on: {
        HEALTH_OK: {
          target: "good_primary_active",
          actions: assign({ cost: () => 0 }),
        },
        DEGRADED: {
          target: "good_primary_degraded",
          actions: assign({ cost: () => 3 }),
        },
        FAILED: {
          target: "bad_primary_failed",
          actions: assign({ cost: () => 20 }),
        },
        SYNC: { target: "good_syncing", actions: assign({ cost: () => 0 }) },
        SHUTDOWN: {
          target: "good_standby",
          actions: assign({ cost: () => 0 }),
        },
        WRONG_STATUS: {
          target: "bad_status_error",
          actions: assign({ cost: () => 8 }),
        },
        MISSING_HEARTBEAT: {
          target: "bad_no_heartbeat",
          actions: assign({ cost: () => 12 }),
        },
      },
    },
    good_primary_degraded: {
      tags: ["Good"],
      on: {
        RECOVERED: {
          target: "good_primary_active",
          actions: assign({ cost: () => -2 }),
        },
        WORSENED: {
          target: "bad_primary_failed",
          actions: assign({ cost: () => 18 }),
        },
        FAILOVER: {
          target: "good_failover_in_progress",
          actions: assign({ cost: () => 5 }),
        },
      },
    },
    good_syncing: {
      tags: ["Good"],
      on: {
        SYNC_OK: {
          target: "good_primary_active",
          actions: assign({ cost: () => 0 }),
        },
        SYNC_FAIL: {
          target: "bad_sync_failed",
          actions: assign({ cost: () => 10 }),
        },
      },
    },
    good_failover_in_progress: {
      tags: ["Good"],
      on: {
        BACKUP_ACTIVE: {
          target: "good_backup_active",
          actions: assign({ cost: () => 0 }),
        },
        FAILOVER_FAIL: {
          target: "bad_failover_failed",
          actions: assign({ cost: () => 25 }),
        },
      },
    },
    good_backup_active: {
      tags: ["Good"],
      on: {
        HEALTH_OK: {
          target: "good_backup_active",
          actions: assign({ cost: () => 0 }),
        },
        DEGRADED: {
          target: "good_backup_degraded",
          actions: assign({ cost: () => 3 }),
        },
        FAILED: {
          target: "bad_backup_failed",
          actions: assign({ cost: () => 30 }),
        },
        FAILBACK: {
          target: "good_failback_in_progress",
          actions: assign({ cost: () => 0 }),
        },
        MISSING_HEARTBEAT: {
          target: "bad_no_heartbeat",
          actions: assign({ cost: () => 12 }),
        },
      },
    },
    good_backup_degraded: {
      tags: ["Good"],
      on: {
        RECOVERED: {
          target: "good_backup_active",
          actions: assign({ cost: () => -2 }),
        },
        FAILBACK: {
          target: "good_failback_in_progress",
          actions: assign({ cost: () => 0 }),
        },
        WORSENED: {
          target: "bad_backup_failed",
          actions: assign({ cost: () => 28 }),
        },
      },
    },
    good_failback_in_progress: {
      tags: ["Good"],
      on: {
        FAILBACK_OK: {
          target: "good_primary_active",
          actions: assign({ cost: () => 0 }),
        },
        FAILBACK_FAIL: {
          target: "bad_failback_failed",
          actions: assign({ cost: () => 15 }),
        },
      },
    },
    // Bad states
    bad_invalid_command: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_standby",
          actions: assign({ cost: () => -5 }),
        },
      },
    },
    bad_init_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_initializing",
          actions: assign({ cost: () => -8 }),
        },
      },
    },
    bad_init_timeout: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_initializing",
          actions: assign({ cost: () => -6 }),
        },
      },
    },
    bad_primary_failed: {
      tags: ["Bad"],
      on: {
        FAILOVER: {
          target: "good_failover_in_progress",
          actions: assign({ cost: () => -10 }),
        },
        RECOVER: {
          target: "good_primary_active",
          actions: assign({ cost: () => -12 }),
        },
      },
    },
    bad_status_error: {
      tags: ["Bad"],
      on: {
        CORRECT: {
          target: "good_primary_active",
          actions: assign({ cost: () => -4 }),
        },
      },
    },
    bad_no_heartbeat: {
      tags: ["Bad"],
      on: {
        HEARTBEAT_RECEIVED: {
          target: "good_primary_active",
          actions: assign({ cost: () => -6 }),
        },
        FAILOVER: {
          target: "good_failover_in_progress",
          actions: assign({ cost: () => -4 }),
        },
      },
    },
    bad_sync_failed: {
      tags: ["Bad"],
      on: {
        RETRY: { target: "good_syncing", actions: assign({ cost: () => -5 }) },
        CONTINUE: {
          target: "good_primary_active",
          actions: assign({ cost: () => -3 }),
        },
      },
    },
    bad_failover_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_failover_in_progress",
          actions: assign({ cost: () => -12 }),
        },
        EMERGENCY: {
          target: "good_standby",
          actions: assign({ cost: () => -8 }),
        },
      },
    },
    bad_backup_failed: {
      tags: ["Bad"],
      on: {
        RECOVER: {
          target: "good_backup_active",
          actions: assign({ cost: () => -15 }),
        },
        EMERGENCY: {
          target: "good_standby",
          actions: assign({ cost: () => -10 }),
        },
      },
    },
    bad_failback_failed: {
      tags: ["Bad"],
      on: {
        RETRY: {
          target: "good_failback_in_progress",
          actions: assign({ cost: () => -8 }),
        },
        CONTINUE_BACKUP: {
          target: "good_backup_active",
          actions: assign({ cost: () => -5 }),
        },
      },
    },
  },
});

/**
 * Generate property model for instrumented models
 * These have more states to match the instrumented BSMs
 */
function generateInstrumentedPSM(id: string, basePSM: any): any {
  const baseConfig = basePSM.config;
  const states = { ...baseConfig.states };

  // Add additional monitoring and debug states
  Object.keys(baseConfig.states).forEach((stateName) => {
    if (!stateName.startsWith("bad_")) {
      // Add monitoring variant
      states[`${stateName}_mon`] = {
        tags: ["Good"],
        on: {
          MON_OK: { target: stateName, actions: assign({ cost: () => 0 }) },
          MON_ALERT: {
            target: `bad_mon_alert`,
            actions: assign({ cost: () => 5 }),
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
        actions: assign({ cost: () => -3 }),
      },
    },
  };

  return createMachine({
    id,
    initial: baseConfig.initial,
    context: baseConfig.context,
    states,
  });
}

// Instrumented property models
export const refinedContentManagementPSM = generateInstrumentedPSM(
  "rcmProperty",
  contentManagementPSM
);
export const refinedParcelRouterPSM = generateInstrumentedPSM(
  "rprProperty",
  parcelRouterPSM
);
export const refinedRoverControlPSM = generateInstrumentedPSM(
  "rroProperty",
  roverControlPSM
);
export const refinedFailoverSystemPSM = generateInstrumentedPSM(
  "rfoProperty",
  failoverSystemPSM
);

// Export property model metadata
export const propertyModelsMetadata = {
  CM: { name: "CM Property", machine: contentManagementPSM },
  PR: { name: "PR Property", machine: parcelRouterPSM },
  RO: { name: "RO Property", machine: roverControlPSM },
  FO: { name: "FO Property", machine: failoverSystemPSM },
  RCM: { name: "RCM Property", machine: refinedContentManagementPSM },
  RPR: { name: "RPR Property", machine: refinedParcelRouterPSM },
  RRO: { name: "RRO Property", machine: refinedRoverControlPSM },
  RFO: { name: "RFO Property", machine: refinedFailoverSystemPSM },
};

export type PropertyModelKey = keyof typeof propertyModelsMetadata;

/**
 * Get property model for a given case study
 */
export function getPropertyModel(key: PropertyModelKey) {
  return propertyModelsMetadata[key];
}
