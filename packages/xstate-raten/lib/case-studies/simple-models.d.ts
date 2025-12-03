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
/**
 * CM - Content Management System
 * A basic document management system with state transitions for document lifecycle
 * States: 7, Transitions: 12, LOC: 3
 */
export declare const contentManagementBSM: import("xstate").StateMachine<
  {
    documentId: string | null;
    content: string;
    version: number;
    lastModified: Date | null;
  },
  any,
  import("xstate").AnyEventObject,
  {
    value: any;
    context: {
      documentId: string | null;
      content: string;
      version: number;
      lastModified: Date | null;
    };
  },
  import("xstate").BaseActionObject,
  import("xstate").ServiceMap,
  import("xstate").ResolveTypegenMeta<
    import("xstate").TypegenDisabled,
    import("xstate").AnyEventObject,
    import("xstate").BaseActionObject,
    import("xstate").ServiceMap
  >
>;
/**
 * PR - Parcel Router System
 * Package routing system that manages parcel delivery workflows
 * States: 25, Transitions: 29, LOC: 45
 */
export declare const parcelRouterBSM: import("xstate").StateMachine<
  {
    parcelId: string | null;
    origin: string;
    destination: string;
    weight: number;
    currentLocation: string;
    routeHistory: string[];
    priority: "normal" | "express" | "overnight";
  },
  any,
  import("xstate").AnyEventObject,
  {
    value: any;
    context: {
      parcelId: string | null;
      origin: string;
      destination: string;
      weight: number;
      currentLocation: string;
      routeHistory: string[];
      priority: "normal" | "express" | "overnight";
    };
  },
  import("xstate").BaseActionObject,
  import("xstate").ServiceMap,
  import("xstate").ResolveTypegenMeta<
    import("xstate").TypegenDisabled,
    import("xstate").AnyEventObject,
    import("xstate").BaseActionObject,
    import("xstate").ServiceMap
  >
>;
/**
 * RO - Rover Control System
 * Robotic control system for autonomous navigation and task execution
 * States: 32, Transitions: 38, LOC: 75
 */
export declare const roverControlBSM: import("xstate").StateMachine<
  {
    batteryLevel: number;
    position: {
      x: number;
      y: number;
    };
    heading: number;
    speed: number;
    sensorData: Record<string, any>;
    currentTask: string | null;
    errorLog: string[];
  },
  any,
  import("xstate").AnyEventObject,
  {
    value: any;
    context: {
      batteryLevel: number;
      position: {
        x: number;
        y: number;
      };
      heading: number;
      speed: number;
      sensorData: Record<string, any>;
      currentTask: string | null;
      errorLog: string[];
    };
  },
  import("xstate").BaseActionObject,
  import("xstate").ServiceMap,
  import("xstate").ResolveTypegenMeta<
    import("xstate").TypegenDisabled,
    import("xstate").AnyEventObject,
    import("xstate").BaseActionObject,
    import("xstate").ServiceMap
  >
>;
/**
 * FO - FailOver System
 * Fault-tolerance system that manages backup and recovery operations
 * States: 49, Transitions: 53, LOC: 164
 */
export declare const failoverSystemBSM: import("xstate").StateMachine<
  {
    primaryStatus: "unknown" | "healthy" | "degraded" | "failed";
    backupStatus: "unknown" | "healthy" | "degraded" | "failed";
    activeNode: "none" | "primary" | "backup";
    failoverCount: number;
    lastHealthCheck: Date | null;
    syncStatus: "unknown" | "synced" | "syncing" | "out_of_sync";
    errorQueue: string[];
  },
  any,
  import("xstate").AnyEventObject,
  {
    value: any;
    context: {
      primaryStatus: "unknown" | "healthy" | "degraded" | "failed";
      backupStatus: "unknown" | "healthy" | "degraded" | "failed";
      activeNode: "none" | "primary" | "backup";
      failoverCount: number;
      lastHealthCheck: Date | null;
      syncStatus: "unknown" | "synced" | "syncing" | "out_of_sync";
      errorQueue: string[];
    };
  },
  import("xstate").BaseActionObject,
  import("xstate").ServiceMap,
  import("xstate").ResolveTypegenMeta<
    import("xstate").TypegenDisabled,
    import("xstate").AnyEventObject,
    import("xstate").BaseActionObject,
    import("xstate").ServiceMap
  >
>;
export declare const simpleModelsMetadata: {
  CM: {
    name: string;
    stateCount: number;
    transitionCount: number;
    loc: number;
    machine: import("xstate").StateMachine<
      {
        documentId: string | null;
        content: string;
        version: number;
        lastModified: Date | null;
      },
      any,
      import("xstate").AnyEventObject,
      {
        value: any;
        context: {
          documentId: string | null;
          content: string;
          version: number;
          lastModified: Date | null;
        };
      },
      import("xstate").BaseActionObject,
      import("xstate").ServiceMap,
      import("xstate").ResolveTypegenMeta<
        import("xstate").TypegenDisabled,
        import("xstate").AnyEventObject,
        import("xstate").BaseActionObject,
        import("xstate").ServiceMap
      >
    >;
  };
  PR: {
    name: string;
    stateCount: number;
    transitionCount: number;
    loc: number;
    machine: import("xstate").StateMachine<
      {
        parcelId: string | null;
        origin: string;
        destination: string;
        weight: number;
        currentLocation: string;
        routeHistory: string[];
        priority: "normal" | "express" | "overnight";
      },
      any,
      import("xstate").AnyEventObject,
      {
        value: any;
        context: {
          parcelId: string | null;
          origin: string;
          destination: string;
          weight: number;
          currentLocation: string;
          routeHistory: string[];
          priority: "normal" | "express" | "overnight";
        };
      },
      import("xstate").BaseActionObject,
      import("xstate").ServiceMap,
      import("xstate").ResolveTypegenMeta<
        import("xstate").TypegenDisabled,
        import("xstate").AnyEventObject,
        import("xstate").BaseActionObject,
        import("xstate").ServiceMap
      >
    >;
  };
  RO: {
    name: string;
    stateCount: number;
    transitionCount: number;
    loc: number;
    machine: import("xstate").StateMachine<
      {
        batteryLevel: number;
        position: {
          x: number;
          y: number;
        };
        heading: number;
        speed: number;
        sensorData: Record<string, any>;
        currentTask: string | null;
        errorLog: string[];
      },
      any,
      import("xstate").AnyEventObject,
      {
        value: any;
        context: {
          batteryLevel: number;
          position: {
            x: number;
            y: number;
          };
          heading: number;
          speed: number;
          sensorData: Record<string, any>;
          currentTask: string | null;
          errorLog: string[];
        };
      },
      import("xstate").BaseActionObject,
      import("xstate").ServiceMap,
      import("xstate").ResolveTypegenMeta<
        import("xstate").TypegenDisabled,
        import("xstate").AnyEventObject,
        import("xstate").BaseActionObject,
        import("xstate").ServiceMap
      >
    >;
  };
  FO: {
    name: string;
    stateCount: number;
    transitionCount: number;
    loc: number;
    machine: import("xstate").StateMachine<
      {
        primaryStatus: "unknown" | "healthy" | "degraded" | "failed";
        backupStatus: "unknown" | "healthy" | "degraded" | "failed";
        activeNode: "none" | "primary" | "backup";
        failoverCount: number;
        lastHealthCheck: Date | null;
        syncStatus: "unknown" | "synced" | "syncing" | "out_of_sync";
        errorQueue: string[];
      },
      any,
      import("xstate").AnyEventObject,
      {
        value: any;
        context: {
          primaryStatus: "unknown" | "healthy" | "degraded" | "failed";
          backupStatus: "unknown" | "healthy" | "degraded" | "failed";
          activeNode: "none" | "primary" | "backup";
          failoverCount: number;
          lastHealthCheck: Date | null;
          syncStatus: "unknown" | "synced" | "syncing" | "out_of_sync";
          errorQueue: string[];
        };
      },
      import("xstate").BaseActionObject,
      import("xstate").ServiceMap,
      import("xstate").ResolveTypegenMeta<
        import("xstate").TypegenDisabled,
        import("xstate").AnyEventObject,
        import("xstate").BaseActionObject,
        import("xstate").ServiceMap
      >
    >;
  };
};
export type SimpleModelKey = keyof typeof simpleModelsMetadata;
//# sourceMappingURL=simple-models.d.ts.map
