/**
 * Property State Machines (PSM) for RATEN Evaluation
 *
 * Property models specify expected system behavior and robustness requirements.
 * Each model contains Good states (acceptable) and Bad states (robustness violations)
 * with associated cost values for transitions.
 */
/**
 * CM Property Model - Content Management
 * Specifies acceptable document lifecycle states
 */
export declare const contentManagementPSM: import("xstate").StateMachine<
  {
    cost: number;
    violationCount: number;
  },
  any,
  import("xstate").AnyEventObject,
  {
    value: any;
    context: {
      cost: number;
      violationCount: number;
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
 * PR Property Model - Parcel Router
 * Specifies acceptable routing states and delivery requirements
 */
export declare const parcelRouterPSM: import("xstate").StateMachine<
  {
    cost: number;
    violationCount: number;
  },
  any,
  import("xstate").AnyEventObject,
  {
    value: any;
    context: {
      cost: number;
      violationCount: number;
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
 * RO Property Model - Rover Control
 * Specifies acceptable rover operational states
 */
export declare const roverControlPSM: import("xstate").StateMachine<
  {
    cost: number;
    violationCount: number;
  },
  any,
  import("xstate").AnyEventObject,
  {
    value: any;
    context: {
      cost: number;
      violationCount: number;
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
 * FO Property Model - FailOver System
 * Specifies acceptable failover states and recovery requirements
 */
export declare const failoverSystemPSM: import("xstate").StateMachine<
  {
    cost: number;
    violationCount: number;
  },
  any,
  import("xstate").AnyEventObject,
  {
    value: any;
    context: {
      cost: number;
      violationCount: number;
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
export declare const refinedContentManagementPSM: any;
export declare const refinedParcelRouterPSM: any;
export declare const refinedRoverControlPSM: any;
export declare const refinedFailoverSystemPSM: any;
export declare const propertyModelsMetadata: {
  CM: {
    name: string;
    machine: import("xstate").StateMachine<
      {
        cost: number;
        violationCount: number;
      },
      any,
      import("xstate").AnyEventObject,
      {
        value: any;
        context: {
          cost: number;
          violationCount: number;
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
    machine: import("xstate").StateMachine<
      {
        cost: number;
        violationCount: number;
      },
      any,
      import("xstate").AnyEventObject,
      {
        value: any;
        context: {
          cost: number;
          violationCount: number;
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
    machine: import("xstate").StateMachine<
      {
        cost: number;
        violationCount: number;
      },
      any,
      import("xstate").AnyEventObject,
      {
        value: any;
        context: {
          cost: number;
          violationCount: number;
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
    machine: import("xstate").StateMachine<
      {
        cost: number;
        violationCount: number;
      },
      any,
      import("xstate").AnyEventObject,
      {
        value: any;
        context: {
          cost: number;
          violationCount: number;
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
  RCM: {
    name: string;
    machine: any;
  };
  RPR: {
    name: string;
    machine: any;
  };
  RRO: {
    name: string;
    machine: any;
  };
  RFO: {
    name: string;
    machine: any;
  };
};
export type PropertyModelKey = keyof typeof propertyModelsMetadata;
/**
 * Get property model for a given case study
 */
export declare function getPropertyModel(key: PropertyModelKey):
  | {
      name: string;
      machine: import("xstate").StateMachine<
        {
          cost: number;
          violationCount: number;
        },
        any,
        import("xstate").AnyEventObject,
        {
          value: any;
          context: {
            cost: number;
            violationCount: number;
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
      machine: import("xstate").StateMachine<
        {
          cost: number;
          violationCount: number;
        },
        any,
        import("xstate").AnyEventObject,
        {
          value: any;
          context: {
            cost: number;
            violationCount: number;
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
      machine: import("xstate").StateMachine<
        {
          cost: number;
          violationCount: number;
        },
        any,
        import("xstate").AnyEventObject,
        {
          value: any;
          context: {
            cost: number;
            violationCount: number;
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
      machine: import("xstate").StateMachine<
        {
          cost: number;
          violationCount: number;
        },
        any,
        import("xstate").AnyEventObject,
        {
          value: any;
          context: {
            cost: number;
            violationCount: number;
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
      machine: any;
    }
  | {
      name: string;
      machine: any;
    }
  | {
      name: string;
      machine: any;
    }
  | {
      name: string;
      machine: any;
    };
//# sourceMappingURL=property-models.d.ts.map
