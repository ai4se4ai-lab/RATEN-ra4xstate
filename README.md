# RATEN

Robustness analysis is vital for ensuring the reliability of software systems, particularly those with complex state-based behaviors. In this paper, we introduce RATEN, Robustness Analysis and Test Enhancement Framework for State Machines, a novel framework that leverages quantitative metrics and model-driven techniques to evaluate and enhance robustness. RATEN integrates behavioral and property models to identify common robustness failures (CRFs) and applies cost-based metrics to assess the ability of systems to recover from unexpected states. The framework also features a querying mechanism compatible with existing replay-based testing methods, enabling significant reductions in the size of the test suite while maintaining precision and recall.

## RATEN Implementation for XState

This repository includes a complete implementation of RATEN as an extension package for XState (`@xstate/raten`), providing cost-based robustness evaluation for state machines.

### Features

- **Quantitative Robustness Assessment**: Computes fine-grained cost metrics (OT and BT costs)
- **Property Model Integration**: Uses property models to specify expected system behavior
- **Test Suite Optimization**: Reduces test suite size while maintaining fault detection
- **Runtime Verification**: Acceptable overhead, scalable to complex models

### Installation

```bash
npm install @xstate/raten xstate
```

Or install from the monorepo:

```bash
# Install all dependencies (skip build scripts to avoid tslib issues)
npm install --ignore-scripts

# Or install with legacy peer deps if needed
npm install --legacy-peer-deps --ignore-scripts
```

### Quick Start with RATEN

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
      on: { STOP: 'idle', ERROR: 'error' }
    },
    error: {
      tags: ['Bad'],
      on: { RECOVER: 'idle' }
    }
  }
});

// Define your property model (PSM) with Good/Bad states
const propertyModel = createMachine({
  id: 'requirements',
  initial: 'good',
  states: {
    good: {
      tags: ['Good'],
      on: {
        START: { target: 'good', actions: 'setCost(0)' },
        ERROR: { target: 'bad', actions: 'setCost(10)' }
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
  usrMAX: 50,      // Maximum acceptable total cost
  depthMAX: 5      // Maximum depth for recovery path search
});

// Analyze execution traces
const traces = [
  { event: 'START', message: '' },
  { event: 'ERROR', message: '' },
  { event: 'RECOVER', message: '' }
];

const result = raten.analyze(traces);

console.log('Total Cost:', result.TTcost);
console.log('Off-Track Cost:', result.OTcost);
console.log('Back-Track Cost:', result.BTcost);
console.log('Is Robust:', result.isRobust);
console.log('Violations:', result.violations);
```

### Testing

The RATEN package includes comprehensive tests. To run them:

```bash
cd packages/xstate-raten
npm test
```

**Test Results:**
- ✅ **11/11 tests passing**
- ✅ **3 test suites** (RATEN core, preprocessing, utilities)
- ✅ **Code coverage**: 49% overall (core functionality well covered)

**Test Coverage:**
- `preprocessing.ts`: 96% coverage
- `raten.ts`: 85% coverage
- `traceReplay.ts`: 81% coverage
- `utils.ts`: 75% coverage
- `rcSteps.ts`: 70% coverage

### Core Algorithms

RATEN implements four core algorithms:

1. **Algorithm 1: Property Model Preprocessing** - Classifies transitions into L1-L4 categories
2. **Algorithm 2: Cost Computation** - Computes OT and BT costs from execution traces
3. **Algorithm 3: Back-Track Cost Computation** - BFS-based recovery path finding
4. **Algorithm 4: Property Model Querying** - Test suite reduction

### Documentation

For detailed API documentation, usage examples, and advanced features, see:
- [RATEN Package README](packages/xstate-raten/README.md)
- [Implementation Status](packages/xstate-raten/IMPLEMENTATION_STATUS.md)
- [Test Results](packages/xstate-raten/TEST_RESULTS.md)

### Example: Test Suite Reduction

```typescript
import { RATEN } from '@xstate/raten';

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

console.log('Reduction:', 
  ((1 - reducedTests.length / originalTests.length) * 100).toFixed(2) + '%'
);
```

## quick start

```bash
npm install xstate
```

```js
import { createMachine, interpret } from 'xstate';

// Stateless machine definition
// machine.transition(...) is a pure function used by the interpreter.
const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } }
  }
});

// Machine instance with internal state
const toggleService = interpret(toggleMachine)
  .onTransition((state) => console.log(state.value))
  .start();
// => 'inactive'

toggleService.send('TOGGLE');
// => 'active'

toggleService.send('TOGGLE');
// => 'inactive'
```

## Promise example

[📉 See the visualization on stately.ai/viz](https://stately.ai/viz?gist=bbcb4379b36edea0458f597e5eec2f91)

<details>
<summary>See the code</summary>

```js
import { createMachine, interpret, assign } from 'xstate';

const fetchMachine = createMachine({
  id: 'Dog API',
  initial: 'idle',
  context: {
    dog: null
  },
  states: {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      invoke: {
        id: 'fetchDog',
        src: (context, event) =>
          fetch('https://dog.ceo/api/breeds/image/random').then((data) =>
            data.json()
          ),
        onDone: {
          target: 'resolved',
          actions: assign({
            dog: (_, event) => event.data
          })
        },
        onError: 'rejected'
      },
      on: {
        CANCEL: 'idle'
      }
    },
    resolved: {
      type: 'final'
    },
    rejected: {
      on: {
        FETCH: 'loading'
      }
    }
  }
});

const dogService = interpret(fetchMachine)
  .onTransition((state) => console.log(state.value))
  .start();

dogService.send('FETCH');
```

</details>
## Finite State Machines

<a href="https://stately.ai/viz/2ac5915f-789a-493f-86d3-a8ec079773f4" title="Finite states">
  <img src="https://user-images.githubusercontent.com/1093738/131727631-916d28a7-1a40-45ed-8636-c0c0fc1c3889.gif" alt="Finite states" width="400" />
  <br />
  <small>Open in Stately Viz</small>
</a>
<br />

```js
import { createMachine } from 'xstate';

const lightMachine = createMachine({
  id: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow'
      }
    },
    yellow: {
      on: {
        TIMER: 'red'
      }
    },
    red: {
      on: {
        TIMER: 'green'
      }
    }
  }
});

const currentState = 'green';

const nextState = lightMachine.transition(currentState, 'TIMER').value;

// => 'yellow'
```

## Hierarchical (Nested) State Machines

<a href="https://stately.ai/viz/d3aeda4f-7f8e-44df-bdf9-dd3cdafb3312" title="Hierarchical states">
  <img src="https://user-images.githubusercontent.com/1093738/131727794-86b63c76-5ee0-4d73-b84c-6992a1f0814e.gif" alt="Hierarchical states" width="400" />
  <br />
  <small>Open in Stately Viz</small>
</a>
<br />

```js
import { createMachine } from 'xstate';

const pedestrianStates = {
  initial: 'walk',
  states: {
    walk: {
      on: {
        PED_TIMER: 'wait'
      }
    },
    wait: {
      on: {
        PED_TIMER: 'stop'
      }
    },
    stop: {}
  }
};

const lightMachine = createMachine({
  id: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow'
      }
    },
    yellow: {
      on: {
        TIMER: 'red'
      }
    },
    red: {
      on: {
        TIMER: 'green'
      },
      ...pedestrianStates
    }
  }
});

const currentState = 'yellow';

const nextState = lightMachine.transition(currentState, 'TIMER').value;
// => {
//   red: 'walk'
// }

lightMachine.transition('red.walk', 'PED_TIMER').value;
// => {
//   red: 'wait'
// }
```

**Object notation for hierarchical states:**

```js
// ...
const waitState = lightMachine.transition({ red: 'walk' }, 'PED_TIMER').value;

// => { red: 'wait' }

lightMachine.transition(waitState, 'PED_TIMER').value;

// => { red: 'stop' }

lightMachine.transition({ red: 'stop' }, 'TIMER').value;

// => 'green'
```

## Parallel State Machines

<a href="https://stately.ai/viz/9eb9c189-254d-4c87-827a-fab0c2f71508" title="Parallel states">
  <img src="https://user-images.githubusercontent.com/1093738/131727915-23da4b4b-5e7e-46ea-9c56-5093e37e60e6.gif" alt="Parallel states" width="400" />
  <br />
  <small>Open in Stately Viz</small>
</a>
<br />

```js
const wordMachine = createMachine({
  id: 'word',
  type: 'parallel',
  states: {
    bold: {
      initial: 'off',
      states: {
        on: {
          on: { TOGGLE_BOLD: 'off' }
        },
        off: {
          on: { TOGGLE_BOLD: 'on' }
        }
      }
    },
    underline: {
      initial: 'off',
      states: {
        on: {
          on: { TOGGLE_UNDERLINE: 'off' }
        },
        off: {
          on: { TOGGLE_UNDERLINE: 'on' }
        }
      }
    },
    italics: {
      initial: 'off',
      states: {
        on: {
          on: { TOGGLE_ITALICS: 'off' }
        },
        off: {
          on: { TOGGLE_ITALICS: 'on' }
        }
      }
    },
    list: {
      initial: 'none',
      states: {
        none: {
          on: { BULLETS: 'bullets', NUMBERS: 'numbers' }
        },
        bullets: {
          on: { NONE: 'none', NUMBERS: 'numbers' }
        },
        numbers: {
          on: { BULLETS: 'bullets', NONE: 'none' }
        }
      }
    }
  }
});

const boldState = wordMachine.transition('bold.off', 'TOGGLE_BOLD').value;

// {
//   bold: 'on',
//   italics: 'off',
//   underline: 'off',
//   list: 'none'
// }

const nextState = wordMachine.transition(
  {
    bold: 'off',
    italics: 'off',
    underline: 'on',
    list: 'bullets'
  },
  'TOGGLE_ITALICS'
).value;

// {
//   bold: 'off',
//   italics: 'on',
//   underline: 'on',
//   list: 'bullets'
// }
```

## History States

<a href="https://stately.ai/viz/33fd92e1-f9e6-49e6-bdeb-cef9e60195ec" title="History states">
  <img src="https://user-images.githubusercontent.com/1093738/131728111-819cc824-9881-4ecf-948a-00c1162cd9e9.gif" alt="History state" width="400" />
  <br />
  <small>Open in Stately Viz</small>
</a>
<br />

```js
const paymentMachine = createMachine({
  id: 'payment',
  initial: 'method',
  states: {
    method: {
      initial: 'cash',
      states: {
        cash: { on: { SWITCH_CHECK: 'check' } },
        check: { on: { SWITCH_CASH: 'cash' } },
        hist: { type: 'history' }
      },
      on: { NEXT: 'review' }
    },
    review: {
      on: { PREVIOUS: 'method.hist' }
    }
  }
});

const checkState = paymentMachine.transition('method.cash', 'SWITCH_CHECK');

// => State {
//   value: { method: 'check' },
//   history: State { ... }
// }

const reviewState = paymentMachine.transition(checkState, 'NEXT');

// => State {
//   value: 'review',
//   history: State { ... }
// }

const previousState = paymentMachine.transition(reviewState, 'PREVIOUS').value;

// => { method: 'check' }
```

## Package Structure

This repository is a monorepo containing:

- **`packages/core`**: Core XState library
- **`packages/xstate-raten`**: RATEN extension for XState (robustness analysis)
- Other XState packages...

## Development

### Building the Project

```bash
# Install dependencies (skip build scripts to avoid tslib compatibility issues)
npm install --ignore-scripts

# Build specific package
cd packages/xstate-raten
npm run build

# Or build all packages (may encounter tslib issues in some packages)
npm run build
```

### Running Tests

```bash
# Test RATEN package
cd packages/xstate-raten
npm test

# Test with coverage
npm test -- --coverage

# Test all packages
npm test
```

### Known Issues

- **tslib compatibility**: Some packages may have build issues with `rollup-plugin-typescript2` and newer tslib versions. This doesn't affect runtime functionality. Use `--ignore-scripts` during installation to skip problematic builds.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
