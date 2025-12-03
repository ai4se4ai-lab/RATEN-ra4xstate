/**
 * Case Studies Index
 * Exports all behavioral state machines (BSM) and property state machines (PSM) for RATEN evaluation
 */
export * from "./simple-models";
export * from "./instrumented-models";
export * from "./property-models";
import { SimpleModelKey } from "./simple-models";
import { InstrumentedModelKey } from "./instrumented-models";
export declare const allModelsMetadata: {
  RCM: {
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
        debugLog: string[];
        monitoringEnabled: boolean;
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
          debugLog: string[];
          monitoringEnabled: boolean;
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
  RPR: {
    name: string;
    stateCount: number;
    transitionCount: number;
    loc: number;
    machine: import("xstate").StateMachine<
      {
        parcelId: string | null;
        debugLog: string[];
        monitoringEnabled: boolean;
      },
      any,
      import("xstate").AnyEventObject,
      {
        value: any;
        context: {
          parcelId: string | null;
          debugLog: string[];
          monitoringEnabled: boolean;
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
  RRO: {
    name: string;
    stateCount: number;
    transitionCount: number;
    loc: number;
    machine: any;
  };
  RFO: {
    name: string;
    stateCount: number;
    transitionCount: number;
    loc: number;
    machine: any;
  };
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
export type ModelKey = SimpleModelKey | InstrumentedModelKey;
export declare const simpleModelKeys: SimpleModelKey[];
export declare const instrumentedModelKeys: InstrumentedModelKey[];
export declare const allModelKeys: ModelKey[];
/**
 * Get model metadata by key
 */
export declare function getModelMetadata(key: ModelKey):
  | {
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
    }
  | {
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
    }
  | {
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
    }
  | {
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
    }
  | {
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
          debugLog: string[];
          monitoringEnabled: boolean;
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
            debugLog: string[];
            monitoringEnabled: boolean;
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
    }
  | {
      name: string;
      stateCount: number;
      transitionCount: number;
      loc: number;
      machine: import("xstate").StateMachine<
        {
          parcelId: string | null;
          debugLog: string[];
          monitoringEnabled: boolean;
        },
        any,
        import("xstate").AnyEventObject,
        {
          value: any;
          context: {
            parcelId: string | null;
            debugLog: string[];
            monitoringEnabled: boolean;
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
    }
  | {
      name: string;
      stateCount: number;
      transitionCount: number;
      loc: number;
      machine: any;
    }
  | {
      name: string;
      stateCount: number;
      transitionCount: number;
      loc: number;
      machine: any;
    };
/**
 * Get all simple models
 */
export declare function getSimpleModels(): (
  | {
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
      key: "CM" | "PR" | "RO" | "FO";
    }
  | {
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
      key: "CM" | "PR" | "RO" | "FO";
    }
  | {
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
      key: "CM" | "PR" | "RO" | "FO";
    }
  | {
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
      key: "CM" | "PR" | "RO" | "FO";
    }
)[];
/**
 * Get all instrumented models
 */
export declare function getInstrumentedModels(): (
  | {
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
          debugLog: string[];
          monitoringEnabled: boolean;
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
            debugLog: string[];
            monitoringEnabled: boolean;
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
      key: "RCM" | "RPR" | "RRO" | "RFO";
    }
  | {
      name: string;
      stateCount: number;
      transitionCount: number;
      loc: number;
      machine: import("xstate").StateMachine<
        {
          parcelId: string | null;
          debugLog: string[];
          monitoringEnabled: boolean;
        },
        any,
        import("xstate").AnyEventObject,
        {
          value: any;
          context: {
            parcelId: string | null;
            debugLog: string[];
            monitoringEnabled: boolean;
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
      key: "RCM" | "RPR" | "RRO" | "RFO";
    }
  | {
      name: string;
      stateCount: number;
      transitionCount: number;
      loc: number;
      machine: any;
      key: "RCM" | "RPR" | "RRO" | "RFO";
    }
  | {
      name: string;
      stateCount: number;
      transitionCount: number;
      loc: number;
      machine: any;
      key: "RCM" | "RPR" | "RRO" | "RFO";
    }
)[];
/**
 * Get all models
 */
export declare function getAllModels(): (
  | {
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
      key: ModelKey;
    }
  | {
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
      key: ModelKey;
    }
  | {
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
      key: ModelKey;
    }
  | {
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
      key: ModelKey;
    }
  | {
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
          debugLog: string[];
          monitoringEnabled: boolean;
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
            debugLog: string[];
            monitoringEnabled: boolean;
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
      key: ModelKey;
    }
  | {
      name: string;
      stateCount: number;
      transitionCount: number;
      loc: number;
      machine: import("xstate").StateMachine<
        {
          parcelId: string | null;
          debugLog: string[];
          monitoringEnabled: boolean;
        },
        any,
        import("xstate").AnyEventObject,
        {
          value: any;
          context: {
            parcelId: string | null;
            debugLog: string[];
            monitoringEnabled: boolean;
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
      key: ModelKey;
    }
  | {
      name: string;
      stateCount: number;
      transitionCount: number;
      loc: number;
      machine: any;
      key: ModelKey;
    }
  | {
      name: string;
      stateCount: number;
      transitionCount: number;
      loc: number;
      machine: any;
      key: ModelKey;
    }
)[];
//# sourceMappingURL=index.d.ts.map
