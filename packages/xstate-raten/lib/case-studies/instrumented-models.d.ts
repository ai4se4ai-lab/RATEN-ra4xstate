/**
 * Instrumented Case Study Models for RATEN Evaluation
 * Based on Table 1 from the research paper
 *
 * These models are enhanced versions generated using MDebugger approach
 * that include additional debugging information and monitoring capabilities.
 *
 * - RCM (Refined Content Management): 25 states, 28 transitions
 * - RPR (Refined Parcel Router): 68 states, 76 transitions
 * - RRO (Refined Rover Control): 1,043 states, 1,087 transitions
 * - RFO (Refined FailOver System): 2,364 states, 2,396 transitions
 */
/**
 * RCM - Refined Content Management System
 * Instrumented version with debugging capabilities
 * States: 25, Transitions: 28, LOC: 40
 */
export declare const refinedContentManagementBSM: import("xstate").StateMachine<
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
export declare const refinedParcelRouterBSM: import("xstate").StateMachine<
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
/**
 * RRO - Refined Rover Control System
 * Large instrumented version with extensive debugging
 * States: 1,043, Transitions: 1,087, LOC: 255
 */
export declare const refinedRoverControlBSM: any;
/**
 * RFO - Refined FailOver System
 * Very large instrumented version
 * States: 2,364, Transitions: 2,396, LOC: 764
 */
export declare const refinedFailoverSystemBSM: any;
export declare function countMachineElements(machine: any): {
  states: number;
  transitions: number;
};
export declare const instrumentedModelsMetadata: {
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
};
export type InstrumentedModelKey = keyof typeof instrumentedModelsMetadata;
//# sourceMappingURL=instrumented-models.d.ts.map
