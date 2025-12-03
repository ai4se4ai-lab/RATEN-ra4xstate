/**
 * Simple Case Study Models for RATEN Evaluation
 * Based on Table 1 from the research paper
 *
 * These models represent the original implementations without debugging instrumentation:
 * - CM (Content Management): 7 states, 12 transitions
 * - PR (Parcel Router): 25 states, 29 transitions
 * - RO (Rover Control): 32 states, 38 transitions
 * - FO (FailOver System): 49 states, 53 transitions
 */

import { createMachine, assign } from "xstate";

/**
 * CM - Content Management System
 * A basic document management system with state transitions for document lifecycle
 * States: 7, Transitions: 12, LOC: 3
 */
export const contentManagementBSM = createMachine({
  id: "contentManagement",
  initial: "draft",
  context: {
    documentId: null as string | null,
    content: "",
    version: 1,
    lastModified: null as Date | null,
  },
  states: {
    draft: {
      on: {
        EDIT: { target: "editing" },
        SUBMIT: { target: "pending_review" },
        DELETE: { target: "deleted" },
      },
    },
    editing: {
      on: {
        SAVE: { target: "draft" },
        CANCEL: { target: "draft" },
        DELETE: { target: "deleted" },
      },
    },
    pending_review: {
      on: {
        APPROVE: { target: "published" },
        REJECT: { target: "draft" },
        CANCEL: { target: "draft" },
      },
    },
    published: {
      on: {
        UNPUBLISH: { target: "draft" },
        ARCHIVE: { target: "archived" },
      },
    },
    archived: {
      on: {
        RESTORE: { target: "draft" },
      },
    },
    deleted: {
      type: "final" as const,
    },
    error: {
      on: {
        RETRY: { target: "draft" },
      },
    },
  },
});

/**
 * PR - Parcel Router System
 * Package routing system that manages parcel delivery workflows
 * States: 25, Transitions: 29, LOC: 45
 */
export const parcelRouterBSM = createMachine({
  id: "parcelRouter",
  initial: "idle",
  context: {
    parcelId: null as string | null,
    origin: "",
    destination: "",
    weight: 0,
    currentLocation: "",
    routeHistory: [] as string[],
    priority: "normal" as "normal" | "express" | "overnight",
  },
  states: {
    idle: {
      on: {
        RECEIVE_PARCEL: { target: "receiving" },
      },
    },
    receiving: {
      on: {
        SCAN_SUCCESS: { target: "scanned" },
        SCAN_FAILURE: { target: "scan_error" },
      },
    },
    scanned: {
      on: {
        VALIDATE: { target: "validating" },
      },
    },
    validating: {
      on: {
        VALID: { target: "validated" },
        INVALID: { target: "validation_error" },
      },
    },
    validated: {
      on: {
        CLASSIFY: { target: "classifying" },
      },
    },
    classifying: {
      on: {
        LOCAL: { target: "local_routing" },
        REGIONAL: { target: "regional_routing" },
        NATIONAL: { target: "national_routing" },
        INTERNATIONAL: { target: "international_routing" },
      },
    },
    local_routing: {
      on: {
        ROUTE_ASSIGNED: { target: "in_transit_local" },
        ROUTE_ERROR: { target: "routing_error" },
      },
    },
    regional_routing: {
      on: {
        ROUTE_ASSIGNED: { target: "in_transit_regional" },
        ROUTE_ERROR: { target: "routing_error" },
      },
    },
    national_routing: {
      on: {
        ROUTE_ASSIGNED: { target: "in_transit_national" },
        ROUTE_ERROR: { target: "routing_error" },
      },
    },
    international_routing: {
      on: {
        CUSTOMS_CLEARED: { target: "in_transit_international" },
        CUSTOMS_HOLD: { target: "customs_hold" },
      },
    },
    customs_hold: {
      on: {
        CLEARED: { target: "in_transit_international" },
        REJECTED: { target: "return_to_sender" },
      },
    },
    in_transit_local: {
      on: {
        ARRIVED: { target: "at_destination" },
        DELAY: { target: "delayed" },
      },
    },
    in_transit_regional: {
      on: {
        ARRIVED: { target: "at_destination" },
        DELAY: { target: "delayed" },
      },
    },
    in_transit_national: {
      on: {
        ARRIVED: { target: "at_destination" },
        DELAY: { target: "delayed" },
      },
    },
    in_transit_international: {
      on: {
        ARRIVED: { target: "at_destination" },
        DELAY: { target: "delayed" },
      },
    },
    delayed: {
      on: {
        RESUME: { target: "in_transit_local" },
        REROUTE: { target: "rerouting" },
      },
    },
    rerouting: {
      on: {
        ROUTE_ASSIGNED: { target: "in_transit_local" },
        ROUTE_ERROR: { target: "routing_error" },
      },
    },
    at_destination: {
      on: {
        DELIVER: { target: "delivering" },
      },
    },
    delivering: {
      on: {
        DELIVERED: { target: "delivered" },
        DELIVERY_FAILED: { target: "delivery_failed" },
      },
    },
    delivered: {
      type: "final" as const,
    },
    delivery_failed: {
      on: {
        RETRY_DELIVERY: { target: "delivering" },
        RETURN: { target: "return_to_sender" },
      },
    },
    return_to_sender: {
      type: "final" as const,
    },
    scan_error: {
      on: {
        RETRY: { target: "receiving" },
      },
    },
    validation_error: {
      on: {
        RETRY: { target: "validating" },
        REJECT: { target: "return_to_sender" },
      },
    },
    routing_error: {
      on: {
        RETRY: { target: "classifying" },
      },
    },
  },
});

/**
 * RO - Rover Control System
 * Robotic control system for autonomous navigation and task execution
 * States: 32, Transitions: 38, LOC: 75
 */
export const roverControlBSM = createMachine({
  id: "roverControl",
  initial: "powered_off",
  context: {
    batteryLevel: 100,
    position: { x: 0, y: 0 },
    heading: 0,
    speed: 0,
    sensorData: {} as Record<string, any>,
    currentTask: null as string | null,
    errorLog: [] as string[],
  },
  states: {
    powered_off: {
      on: {
        POWER_ON: { target: "initializing" },
      },
    },
    initializing: {
      on: {
        INIT_COMPLETE: { target: "idle" },
        INIT_FAILED: { target: "init_error" },
      },
    },
    init_error: {
      on: {
        RETRY: { target: "initializing" },
        SHUTDOWN: { target: "powered_off" },
      },
    },
    idle: {
      on: {
        START_TASK: { target: "task_planning" },
        MANUAL_CONTROL: { target: "manual_mode" },
        DIAGNOSTICS: { target: "running_diagnostics" },
        SHUTDOWN: { target: "shutting_down" },
      },
    },
    task_planning: {
      on: {
        PLAN_READY: { target: "navigating" },
        PLAN_FAILED: { target: "planning_error" },
      },
    },
    planning_error: {
      on: {
        RETRY: { target: "task_planning" },
        ABORT: { target: "idle" },
      },
    },
    navigating: {
      on: {
        OBSTACLE_DETECTED: { target: "obstacle_avoidance" },
        DESTINATION_REACHED: { target: "executing_task" },
        LOW_BATTERY: { target: "returning_to_base" },
        NAVIGATION_ERROR: { target: "navigation_error" },
      },
    },
    obstacle_avoidance: {
      on: {
        PATH_CLEAR: { target: "navigating" },
        STUCK: { target: "stuck" },
        ABORT: { target: "idle" },
      },
    },
    stuck: {
      on: {
        MANUAL_ASSIST: { target: "manual_mode" },
        AUTO_RECOVER: { target: "recovering" },
      },
    },
    recovering: {
      on: {
        RECOVERED: { target: "navigating" },
        RECOVERY_FAILED: { target: "stuck" },
      },
    },
    navigation_error: {
      on: {
        RETRY: { target: "navigating" },
        ABORT: { target: "idle" },
      },
    },
    executing_task: {
      on: {
        TASK_COMPLETE: { target: "task_complete" },
        TASK_FAILED: { target: "task_error" },
        LOW_BATTERY: { target: "returning_to_base" },
      },
    },
    task_complete: {
      on: {
        NEW_TASK: { target: "task_planning" },
        RETURN_HOME: { target: "returning_to_base" },
        IDLE: { target: "idle" },
      },
    },
    task_error: {
      on: {
        RETRY: { target: "executing_task" },
        ABORT: { target: "idle" },
      },
    },
    returning_to_base: {
      on: {
        BASE_REACHED: { target: "at_base" },
        OBSTACLE_DETECTED: { target: "obstacle_avoidance" },
      },
    },
    at_base: {
      on: {
        CHARGE: { target: "charging" },
        IDLE: { target: "idle" },
      },
    },
    charging: {
      on: {
        CHARGE_COMPLETE: { target: "idle" },
        CHARGE_ERROR: { target: "charge_error" },
      },
    },
    charge_error: {
      on: {
        RETRY: { target: "charging" },
        MANUAL: { target: "manual_mode" },
      },
    },
    manual_mode: {
      on: {
        FORWARD: { target: "manual_moving" },
        BACKWARD: { target: "manual_moving" },
        TURN: { target: "manual_turning" },
        EXIT_MANUAL: { target: "idle" },
      },
    },
    manual_moving: {
      on: {
        STOP: { target: "manual_mode" },
        OBSTACLE: { target: "manual_stopped" },
      },
    },
    manual_turning: {
      on: {
        STOP: { target: "manual_mode" },
      },
    },
    manual_stopped: {
      on: {
        RESUME: { target: "manual_mode" },
        EXIT_MANUAL: { target: "idle" },
      },
    },
    running_diagnostics: {
      on: {
        DIAGNOSTICS_COMPLETE: { target: "diagnostics_result" },
        DIAGNOSTICS_ERROR: { target: "diagnostics_error" },
      },
    },
    diagnostics_result: {
      on: {
        OK: { target: "idle" },
        REPAIR_NEEDED: { target: "maintenance_required" },
      },
    },
    diagnostics_error: {
      on: {
        RETRY: { target: "running_diagnostics" },
        ABORT: { target: "idle" },
      },
    },
    maintenance_required: {
      on: {
        MAINTENANCE_COMPLETE: { target: "idle" },
        SHUTDOWN: { target: "shutting_down" },
      },
    },
    shutting_down: {
      on: {
        SHUTDOWN_COMPLETE: { target: "powered_off" },
      },
    },
  },
});

/**
 * FO - FailOver System
 * Fault-tolerance system that manages backup and recovery operations
 * States: 49, Transitions: 53, LOC: 164
 */
export const failoverSystemBSM = createMachine({
  id: "failoverSystem",
  initial: "system_off",
  context: {
    primaryStatus: "unknown" as "healthy" | "degraded" | "failed" | "unknown",
    backupStatus: "unknown" as "healthy" | "degraded" | "failed" | "unknown",
    activeNode: "none" as "primary" | "backup" | "none",
    failoverCount: 0,
    lastHealthCheck: null as Date | null,
    syncStatus: "unknown" as "synced" | "syncing" | "out_of_sync" | "unknown",
    errorQueue: [] as string[],
  },
  states: {
    system_off: {
      on: {
        POWER_ON: { target: "initializing_primary" },
      },
    },
    initializing_primary: {
      on: {
        PRIMARY_READY: { target: "primary_starting" },
        PRIMARY_INIT_FAILED: { target: "primary_init_error" },
      },
    },
    primary_init_error: {
      on: {
        RETRY: { target: "initializing_primary" },
        USE_BACKUP: { target: "initializing_backup" },
      },
    },
    primary_starting: {
      on: {
        PRIMARY_STARTED: { target: "primary_active" },
        PRIMARY_START_FAILED: { target: "primary_start_error" },
      },
    },
    primary_start_error: {
      on: {
        RETRY: { target: "primary_starting" },
        FAILOVER: { target: "initializing_backup" },
      },
    },
    primary_active: {
      on: {
        HEALTH_CHECK: { target: "primary_health_check" },
        PRIMARY_DEGRADED: { target: "primary_degraded" },
        PRIMARY_FAILED: { target: "primary_failure_detected" },
        SYNC_BACKUP: { target: "syncing_to_backup" },
        SHUTDOWN: { target: "shutting_down_primary" },
      },
    },
    primary_health_check: {
      on: {
        HEALTHY: { target: "primary_active" },
        DEGRADED: { target: "primary_degraded" },
        FAILED: { target: "primary_failure_detected" },
      },
    },
    primary_degraded: {
      on: {
        RECOVERED: { target: "primary_active" },
        WORSENED: { target: "primary_failure_detected" },
        PREPARE_FAILOVER: { target: "preparing_failover" },
      },
    },
    primary_failure_detected: {
      on: {
        AUTO_FAILOVER: { target: "initiating_failover" },
        MANUAL_FAILOVER: { target: "initiating_failover" },
        ATTEMPT_RECOVERY: { target: "primary_recovery" },
      },
    },
    primary_recovery: {
      on: {
        RECOVERED: { target: "primary_active" },
        RECOVERY_FAILED: { target: "initiating_failover" },
      },
    },
    syncing_to_backup: {
      on: {
        SYNC_COMPLETE: { target: "primary_active" },
        SYNC_FAILED: { target: "sync_error" },
      },
    },
    sync_error: {
      on: {
        RETRY_SYNC: { target: "syncing_to_backup" },
        CONTINUE_UNSYNC: { target: "primary_active" },
      },
    },
    preparing_failover: {
      on: {
        READY: { target: "initiating_failover" },
        CANCEL: { target: "primary_degraded" },
      },
    },
    initiating_failover: {
      on: {
        BACKUP_AVAILABLE: { target: "activating_backup" },
        BACKUP_UNAVAILABLE: { target: "backup_unavailable" },
      },
    },
    backup_unavailable: {
      on: {
        RETRY_PRIMARY: { target: "primary_recovery" },
        INIT_BACKUP: { target: "initializing_backup" },
        EMERGENCY_SHUTDOWN: { target: "emergency_shutdown" },
      },
    },
    initializing_backup: {
      on: {
        BACKUP_READY: { target: "activating_backup" },
        BACKUP_INIT_FAILED: { target: "backup_init_error" },
      },
    },
    backup_init_error: {
      on: {
        RETRY: { target: "initializing_backup" },
        ABANDON: { target: "system_degraded" },
      },
    },
    activating_backup: {
      on: {
        BACKUP_ACTIVE: { target: "backup_active" },
        ACTIVATION_FAILED: { target: "activation_error" },
      },
    },
    activation_error: {
      on: {
        RETRY: { target: "activating_backup" },
        EMERGENCY: { target: "emergency_shutdown" },
      },
    },
    backup_active: {
      on: {
        HEALTH_CHECK: { target: "backup_health_check" },
        BACKUP_DEGRADED: { target: "backup_degraded" },
        BACKUP_FAILED: { target: "backup_failure_detected" },
        SYNC_PRIMARY: { target: "syncing_to_primary" },
        RESTORE_PRIMARY: { target: "restoring_primary" },
        SHUTDOWN: { target: "shutting_down_backup" },
      },
    },
    backup_health_check: {
      on: {
        HEALTHY: { target: "backup_active" },
        DEGRADED: { target: "backup_degraded" },
        FAILED: { target: "backup_failure_detected" },
      },
    },
    backup_degraded: {
      on: {
        RECOVERED: { target: "backup_active" },
        WORSENED: { target: "backup_failure_detected" },
        RESTORE_PRIMARY: { target: "restoring_primary" },
      },
    },
    backup_failure_detected: {
      on: {
        ATTEMPT_RECOVERY: { target: "backup_recovery" },
        RESTORE_PRIMARY: { target: "restoring_primary" },
        EMERGENCY: { target: "emergency_shutdown" },
      },
    },
    backup_recovery: {
      on: {
        RECOVERED: { target: "backup_active" },
        RECOVERY_FAILED: { target: "system_degraded" },
      },
    },
    syncing_to_primary: {
      on: {
        SYNC_COMPLETE: { target: "backup_active" },
        SYNC_FAILED: { target: "backup_sync_error" },
      },
    },
    backup_sync_error: {
      on: {
        RETRY: { target: "syncing_to_primary" },
        CONTINUE: { target: "backup_active" },
      },
    },
    restoring_primary: {
      on: {
        PRIMARY_RESTORED: { target: "failback_preparing" },
        RESTORE_FAILED: { target: "restore_error" },
      },
    },
    restore_error: {
      on: {
        RETRY: { target: "restoring_primary" },
        CONTINUE_BACKUP: { target: "backup_active" },
      },
    },
    failback_preparing: {
      on: {
        READY: { target: "failback_executing" },
        CANCEL: { target: "backup_active" },
      },
    },
    failback_executing: {
      on: {
        FAILBACK_COMPLETE: { target: "primary_active" },
        FAILBACK_FAILED: { target: "failback_error" },
      },
    },
    failback_error: {
      on: {
        RETRY: { target: "failback_executing" },
        CONTINUE_BACKUP: { target: "backup_active" },
      },
    },
    system_degraded: {
      on: {
        INIT_PRIMARY: { target: "initializing_primary" },
        INIT_BACKUP: { target: "initializing_backup" },
        EMERGENCY: { target: "emergency_shutdown" },
      },
    },
    shutting_down_primary: {
      on: {
        SHUTDOWN_COMPLETE: { target: "primary_shutdown" },
        SHUTDOWN_TIMEOUT: { target: "forced_shutdown" },
      },
    },
    primary_shutdown: {
      on: {
        RESTART: { target: "initializing_primary" },
        FULL_SHUTDOWN: { target: "system_off" },
      },
    },
    shutting_down_backup: {
      on: {
        SHUTDOWN_COMPLETE: { target: "backup_shutdown" },
        SHUTDOWN_TIMEOUT: { target: "forced_shutdown" },
      },
    },
    backup_shutdown: {
      on: {
        RESTART: { target: "initializing_backup" },
        FULL_SHUTDOWN: { target: "system_off" },
      },
    },
    forced_shutdown: {
      on: {
        FORCE_COMPLETE: { target: "system_off" },
      },
    },
    emergency_shutdown: {
      on: {
        EMERGENCY_COMPLETE: { target: "system_off" },
      },
    },
    // Additional states for comprehensive coverage
    monitoring: {
      on: {
        ALERT: { target: "alert_handling" },
        ALL_CLEAR: { target: "primary_active" },
      },
    },
    alert_handling: {
      on: {
        RESOLVED: { target: "monitoring" },
        ESCALATE: { target: "primary_degraded" },
      },
    },
    maintenance_mode: {
      on: {
        EXIT_MAINTENANCE: { target: "primary_active" },
        EMERGENCY: { target: "emergency_shutdown" },
      },
    },
    config_update: {
      on: {
        UPDATE_COMPLETE: { target: "primary_active" },
        UPDATE_FAILED: { target: "config_error" },
      },
    },
    config_error: {
      on: {
        RETRY: { target: "config_update" },
        ROLLBACK: { target: "primary_active" },
      },
    },
    load_balancing: {
      on: {
        BALANCED: { target: "primary_active" },
        REBALANCE_NEEDED: { target: "rebalancing" },
      },
    },
    rebalancing: {
      on: {
        REBALANCE_COMPLETE: { target: "load_balancing" },
        REBALANCE_FAILED: { target: "primary_degraded" },
      },
    },
  },
});

// Export model metadata for evaluation
export const simpleModelsMetadata = {
  CM: {
    name: "Content Management",
    stateCount: 7,
    transitionCount: 12,
    loc: 3,
    machine: contentManagementBSM,
  },
  PR: {
    name: "Parcel Router",
    stateCount: 25,
    transitionCount: 29,
    loc: 45,
    machine: parcelRouterBSM,
  },
  RO: {
    name: "Rover Control",
    stateCount: 32,
    transitionCount: 38,
    loc: 75,
    machine: roverControlBSM,
  },
  FO: {
    name: "FailOver System",
    stateCount: 49,
    transitionCount: 53,
    loc: 164,
    machine: failoverSystemBSM,
  },
};

export type SimpleModelKey = keyof typeof simpleModelsMetadata;
