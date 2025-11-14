# @xstate/raten

RATEN (Robustness Analysis Through Execution Norms) extension for XState.

## Overview

RATEN addresses the critical challenge of evaluating system resilience to unexpected runtime conditions through a novel cost-based approach that distinguishes between:

- **Off-Track (OT) Costs**: Immediate impact of deviations from expected behavior
- **Back-Track (BT) Costs**: Recovery effort required to return to normal operation

The framework targets three common types of runtime robustness failures:

1. **Wrong Message (WM)**: Receiving unexpected message types
2. **Wrong Payload (WP)**: Receiving messages with malformed or unexpected data
3. **Missing Message (MM)**: Failure to receive expected messages within specified timeframes

## Key Features

### Quantitative Robustness Assessment

- Computes fine-grained cost metrics beyond binary classifications
- Provides actionable insights for system improvement and testing prioritization
- Enables cost-benefit analysis of robustness improvements

### Property Model Integration

- Uses property models (state machines) to specify expected system behavior
- Reduces dependence on manual domain expert input during testing
- Distinguishes between Good states (acceptable) and Bad states (robustness violations)

### Test Suite Optimization

- Integrates with model-based testing frameworks
- Achieves significant reduction in test suite size
- Maintains equivalent fault detection capability with reduced testing costs

### Runtime Verification

- Acceptable runtime overhead
- Scalable to complex models
- Suitable for integration into development workflows

## Installation

```bash
npm install @xstate/raten xstate
```

## Usage

### Basic Robustness Analysis

```typescript
import { RATEN } from '@xstate/raten';
import { createMachine } from 'xstate';

// Define your behavioral model (BSM)
const behavioralModel = createMachine({
  id: 'mySystem',
  initial: 'idle',
  states: {
    idle: {
      on: { START: 'active' }
    },
    active: {
      on: { STOP: 'idle' }
    }
  }
});

// Define your property model (PSM)
const propertyModel = createMachine({
  id: 'requirements',
  initial: 'good',
  states: {
    good: {
      tags: ['Good'],
      on: {
        START: { target: 'good', actions: 'setCost(0)' },
        UNEXPECTED: { target: 'bad', actions: 'setCost(10)' }
      }
    },
    bad: {
      tags: ['Bad'],
      on: {
        RECOVER: { target: 'good', actions: 'setCost(-5)' }
      }
    }
  }
});

// Initialize RATEN
const raten = new RATEN(behavioralModel, propertyModel, {
  usrMAX: 50,
  depthMAX: 5
});

// Collect execution traces
const traces = [
  { event: 'START', message: '' },
  { event: 'UNEXPECTED', message: '' }
];

// Perform robustness analysis
const result = raten.analyze(traces);

console.log('Total Cost:', result.TTcost);
console.log('Is Robust:', result.isRobust);
console.log('Violations:', result.violations);
```

### Integration with Testing Framework

```typescript
import { RATEN } from '@xstate/raten';

// Initialize RATEN with test enhancement
const raten = new RATEN(behavioralModel, propertyModel);

// Original test suite
const originalTests = [
  { value: 10, action: 'INCREMENT' },
  { value: 50, action: 'SET_HIGH' },
  { value: 20, action: 'INCREMENT' }
];

// Reduce test suite using property model queries
const reducedTests = raten.reduceTestSuite(
  originalTests,
  ['value'], // critical variables
  (testCase, varName) => ({
    state: testCase[varName] >= 100 ? 'bad' : 'good',
    context: { [varName]: testCase[varName] },
    machine: propertyModel
  })
);

console.log('Original size:', originalTests.length);
console.log('Reduced size:', reducedTests.length);
console.log('Reduction:', 
  ((1 - reducedTests.length / originalTests.length) * 100).toFixed(2) + '%'
);
```

## API Reference

### RATEN Class

#### Constructor

```typescript
new RATEN(bsm: StateMachine, psm: StateMachine, config?: RATENConfig)
```

**Parameters:**
- `bsm`: Behavioral State Machine (BSM)
- `psm`: Property State Machine (PSM)
- `config`: Optional configuration object

**Configuration Options:**
- `usrMAX` (number, default: 50): Maximum acceptable total cost threshold
- `depthMAX` (number, default: 5): Maximum depth for back-track cost path search
- `goodStateTags` (string[], default: ['Good']): Tags identifying good states
- `badStateTags` (string[], default: ['Bad']): Tags identifying bad states
- `stateClassifier` (function, optional): Custom function for state classification

#### Methods

##### `analyze(traces: Trace[]): RobustnessResult`

Analyzes execution traces for robustness violations.

**Parameters:**
- `traces`: Array of trace entries, each containing `event` and optional `message`

**Returns:**
- `RobustnessResult` object with:
  - `TTcost`: Total robustness cost (OTcost + BTcost)
  - `OTcost`: Off-Track cost
  - `BTcost`: Back-Track cost
  - `isRobust`: Whether the system is robust (TTcost <= usrMAX)
  - `violations`: Array of robustness violations found

##### `reduceTestSuite(testSuite: TestCase[], criticalVars: string[], simulateExecution?: Function): TestCase[]`

Reduces test suite by filtering tests that would reach Bad states.

**Parameters:**
- `testSuite`: Original test suite
- `criticalVars`: Array of critical variable names to test
- `simulateExecution`: Optional function to simulate test execution

**Returns:**
- Reduced test suite containing only tests that reach Bad states

##### `getTransitionRules(): TransitionRules`

Returns the classified transition rules (L1, L2, L3, L4).

##### `getBSMRCSteps(): RCStep[]`

Returns all RC-steps extracted from the BSM.

##### `getPSMRCSteps(): RCStep[]`

Returns all RC-steps extracted from the PSM.

## Core Algorithms

### Algorithm 1: Property Model Preprocessing

Classifies all transitions in the property model into four categories:

- **L1**: Good → Good (maintaining good behavior, cost = 0)
- **L2**: Good → Bad (robustness violation, cost > 0)
- **L3**: Bad → Good (recovery, cost may be negative)
- **L4**: Bad → Bad (continued degradation, cost accumulates)

### Algorithm 2: Cost Computation

Calculates total robustness cost by processing execution traces and computing both OT and BT costs. The algorithm:

1. Initializes configurations for BSM and PSM
2. Processes traces with message queue
3. Extracts RC-steps for both machines
4. Applies cost rules based on transition classification
5. Checks threshold and returns NotRobust if exceeded

### Algorithm 3: Back-Track Cost Computation

Finds minimum-cost recovery path using breadth-first search:

1. Tries direct recovery path first (minCostPath)
2. If not found or too expensive, uses BFS with increasing depth
3. Finds minimum cost path among all candidates
4. Returns cost or UINT_MAX if no path found

### Algorithm 4: Property Model Querying

Filters test cases based on property model analysis:

1. For each test case and critical variable
2. Simulates execution and queries PSM
3. Filters tests that reach Bad states

## State Classification

States are classified as Good or Bad using the following priority:

1. **State Tags**: States with tags matching `goodStateTags` or `badStateTags`
2. **Naming Convention**: States containing "Good" or "Bad" in their name
3. **Custom Classifier**: If provided, uses custom classification function

## Cost Extraction

Costs are extracted from transition actions. Supported formats:

- Actions with `setCost(value)` pattern
- Actions with `cost` property
- Actions with type containing cost (e.g., "setCost:10")

## Examples

See the `examples/` directory for complete usage examples:

- `basic-usage.ts`: Simple robustness analysis
- `test-enhancement.ts`: Test suite reduction

## License

MIT

## Contributing

Contributions are welcome! Please see the main repository for contribution guidelines.
