# RATEN Evaluation Framework

This module provides comprehensive datasets and evaluation scripts to reproduce the experimental results from the RATEN research paper. The evaluation framework supports all 8 case studies, 3 CRF types, and generates results for Tables 2-3 and Figures 4-6.

## Overview

The evaluation framework consists of five main components:

```
evaluation/
├── mutant-generators.ts    # CRF injection (WM, WP, MM)
├── trace-generators.ts     # Trace generation (Single, Sequential, Nested)
├── basic-evaluation.ts     # Table 2: Basic strategy results
├── compound-evaluation.ts  # Table 3: Compound strategy results
├── mregtest-evaluation.ts  # Figures 4-6: MRegTest integration
├── run-evaluation.ts       # Main evaluation runner
└── index.ts               # Module exports
```

## Quick Start

### Run Complete Evaluation

```typescript
import { runAllEvaluations, printResultsSummary } from "@xstate/raten";

// Run evaluation with 1000 traces per configuration
const output = runAllEvaluations(1000);

// Print summary
printResultsSummary(output);

// Access individual results
console.log("Table 2:", output.table2.results);
console.log("Table 3:", output.table3.results);
console.log("Figures:", output.figures);
console.log("Validation:", output.validation);
```

### Generate Specific Results

```typescript
import {
  runBasicEvaluation,
  runFullCompoundEvaluation,
  runFullMRegTestEvaluation,
} from "@xstate/raten";

// Generate Table 2 results
const table2 = runBasicEvaluation(1000);

// Generate Table 3 results
const table3 = runFullCompoundEvaluation(1000);

// Generate Figures 4-6 data
const figures = runFullMRegTestEvaluation();
```

## Components

### 1. Mutant Generators (`mutant-generators.ts`)

Generates mutants for the three Common Robustness Failures (CRFs):

| CRF Type                 | Description               | Injection Method                        |
| ------------------------ | ------------------------- | --------------------------------------- |
| **WM** (Wrong Message)   | Unexpected message types  | Replaces valid events with invalid ones |
| **WP** (Wrong Payload)   | Malformed payload data    | Corrupts message payloads               |
| **MM** (Missing Message) | Missing expected messages | Replaces messages with TIMEOUT events   |

#### Usage

```typescript
import {
  generateWMmutant,
  generateWPmutant,
  generateMMmutant,
  generateMutant,
  generateCompoundMutant,
} from "@xstate/raten";

const traces = [
  { event: "START", message: { data: "test" } },
  { event: "PROCESS", message: { id: 1 } },
];

// Generate single CRF mutant
const wmMutant = generateWMmutant(traces, {
  injectionRate: 0.1, // 10% injection rate
  injectionPositions: [0], // Specific positions (optional)
  wrongMessages: ["INVALID_EVENT"], // Custom wrong messages (optional)
});

// Generate by CRF type
const mutant = generateMutant(traces, "WP", { injectionRate: 0.2 });

// Generate compound mutant (multiple CRFs)
const compound = generateCompoundMutant(traces, ["WM", "WP", "MM"]);
```

#### Mutant Result Structure

```typescript
interface MutantResult {
  originalTrace: Trace[]; // Original trace
  mutatedTrace: Trace[]; // Mutated trace
  injectionPoints: number[]; // Positions where CRF was injected
  crfType: CRFType; // Type of CRF applied
  expectedBadState: boolean; // Whether violation is expected
}
```

### 2. Trace Generators (`trace-generators.ts`)

Generates execution traces for three execution modes:

| Mode           | Description                        | Failure Pattern       |
| -------------- | ---------------------------------- | --------------------- |
| **Single**     | One failure per execution          | Isolated incidents    |
| **Sequential** | Multiple failures with recovery    | Intermittent problems |
| **Nested**     | Failures before recovery completes | Cascading failures    |

#### Usage

```typescript
import { generateTraces, generateEvaluationTraces } from "@xstate/raten";

// Generate traces with custom configuration
const traceSet = generateTraces({
  modelKey: "CM", // Case study model
  traceCount: 1000, // Number of traces
  averageTraceLength: 20, // Average events per trace
  mode: "Sequential", // Execution mode
  strategy: "Basic", // Testing strategy
  crfTypes: ["WM", "WP"], // CRF types to inject
});

// Generate large evaluation set (100,000 traces)
const evalTraces = generateEvaluationTraces("RFO", "Nested", "Compound", "MM");
```

#### Available Model Events

```typescript
import { MODEL_EVENTS } from "@xstate/raten";

// Get events for Content Management model
const cmEvents = MODEL_EVENTS["CM"];
// cmEvents.normal: ['EDIT', 'SAVE', 'SUBMIT', ...]
// cmEvents.recovery: ['RECOVER', 'RETRY', 'CANCEL']
```

### 3. Basic Evaluation (`basic-evaluation.ts`)

Produces Table 2 results: Basic strategy with single CRF injections.

#### Metrics

| Metric        | Description                                |
| ------------- | ------------------------------------------ |
| **BTcost**    | Back-Track cost computation time (seconds) |
| **ATT**       | Analysis Total Time (seconds)              |
| **Precision** | TP / (TP + FP)                             |
| **Recall**    | TP / (TP + FN)                             |

#### Expected Results Range (from paper)

- **Precision**: 0.77 - 1.00
- **Recall**: 0.78 - 1.00
- **BTcost**: 0.07s (CM/MM) to 10.67s (RFO/WM/Nested)
- **ATT**: 1.12s (CM/MM) to 38.23s (RFO/WM/Nested)

#### Usage

```typescript
import {
  runBasicEvaluation,
  runSingleEvaluation,
  formatAsLatexTable2,
  formatAsJSON,
  formatAsCSV,
} from "@xstate/raten";

// Run full evaluation
const results = runBasicEvaluation(1000);

// Run single configuration
const cmWmSingle = runSingleEvaluation("CM", "WM", "Single", 1000);

// Export formats
console.log(formatAsLatexTable2(results)); // LaTeX table
console.log(formatAsJSON(results)); // JSON
console.log(formatAsCSV(results)); // CSV
```

### 4. Compound Evaluation (`compound-evaluation.ts`)

Produces Table 3 results: Compound strategy with multiple CRF types and runtime overhead analysis.

#### Additional Metrics

| Metric       | Description                  | Range         |
| ------------ | ---------------------------- | ------------- |
| **avgROver** | Average runtime overhead     | 1.02x - 1.28x |
| **CRFs**     | Number of CRF types injected | 2-5           |

#### Usage

```typescript
import {
  runFullCompoundEvaluation,
  runCompoundEvaluation,
  calculateRuntimeOverhead,
  formatAsLatexTable3,
} from "@xstate/raten";

// Run full evaluation
const results = runFullCompoundEvaluation(1000);

// Run single model
const foResult = runCompoundEvaluation("FO", "Nested", 1000);

// Calculate runtime overhead
const overhead = calculateRuntimeOverhead("RFO", 500000);
console.log(`Overhead: ${overhead.overhead}x`);
```

### 5. MRegTest Evaluation (`mregtest-evaluation.ts`)

Produces Figures 4-6: Comparison of MRegTest vs RATEN-enhanced MRegTest.

#### Test Suite Reduction Results (from paper)

| CRF    | Single | Sequential | Nested |
| ------ | ------ | ---------- | ------ |
| **WM** | 17%    | 62%        | 59%    |
| **WP** | 19%    | 37%        | 78%    |
| **MM** | 43%    | 54%        | 77%    |

#### Execution Time Improvement

| CRF    | Single | Sequential | Nested |
| ------ | ------ | ---------- | ------ |
| **WM** | -16%   | +13%       | +20%   |
| **WP** | -28%   | +9%        | +54%   |
| **MM** | +19%   | +31%       | +53%   |

#### Usage

```typescript
import {
  runFullMRegTestEvaluation,
  generateMRegTestResults,
  getDetailedComparison,
  generateSummaryTable,
} from "@xstate/raten";

// Run full evaluation
const { figures, summaries } = runFullMRegTestEvaluation();

// Get data for specific CRF type
const wmData = generateMRegTestResults("WM");

// Get detailed comparison
const comparison = getDetailedComparison("MM", 500000, "Nested");
console.log(`Size reduction: ${comparison.sizeReduction}%`);
console.log(`Time improvement: ${comparison.timeImprovement}%`);

// Generate markdown summary table
console.log(generateSummaryTable(summaries));
```

## Case Studies

The evaluation uses 8 case studies from the research paper:

### Simple Models

| Model  | Name               | States | Transitions | Description                   |
| ------ | ------------------ | ------ | ----------- | ----------------------------- |
| **CM** | Content Management | 7      | 12          | Document lifecycle management |
| **PR** | Parcel Router      | 25     | 29          | Package routing workflow      |
| **RO** | Rover Control      | 32     | 38          | Robotic navigation system     |
| **FO** | FailOver System    | 49     | 53          | Fault tolerance management    |

### Instrumented Models

| Model   | Name       | States | Transitions | Description                       |
| ------- | ---------- | ------ | ----------- | --------------------------------- |
| **RCM** | Refined CM | 25     | 28          | CM with debugging instrumentation |
| **RPR** | Refined PR | 68     | 76          | PR with debugging instrumentation |
| **RRO** | Refined RO | 1,043  | 1,087       | RO with debugging instrumentation |
| **RFO** | Refined FO | 2,364  | 2,396       | FO with debugging instrumentation |

### Accessing Case Studies

```typescript
import {
  simpleModelsMetadata,
  instrumentedModelsMetadata,
  propertyModelsMetadata,
  getModelMetadata,
  getAllModels,
} from "@xstate/raten";

// Get specific model
const cmModel = simpleModelsMetadata.CM;
console.log(`${cmModel.name}: ${cmModel.stateCount} states`);

// Get all models
const allModels = getAllModels();
allModels.forEach((m) => console.log(`${m.key}: ${m.stateCount} states`));
```

## Output Formats

### LaTeX Tables

```typescript
import { formatAsLatexTable2, formatAsLatexTable3 } from "@xstate/raten";

const table2 = runBasicEvaluation(1000);
const table3 = runFullCompoundEvaluation(1000);

// Generate LaTeX for paper
console.log(formatAsLatexTable2(table2));
console.log(formatAsLatexTable3(table3));
```

### JSON Export

```typescript
import {
  formatAsJSON,
  formatCompoundAsJSON,
  formatFigureAsJSON,
} from "@xstate/raten";

// Export as JSON
const jsonTable2 = formatAsJSON(table2);
const jsonTable3 = formatCompoundAsJSON(table3);
const jsonFigure = formatFigureAsJSON(figures.WM);
```

### CSV Export

```typescript
import {
  formatAsCSV,
  formatCompoundAsCSV,
  formatFigureAsCSV,
} from "@xstate/raten";

// Export as CSV
const csvTable2 = formatAsCSV(table2);
const csvTable3 = formatCompoundAsCSV(table3);
const csvFigure = formatFigureAsCSV(figures.WM, "Sequential");
```

## Validation

The evaluation framework includes automatic validation against expected paper values:

```typescript
import { runAllEvaluations } from "@xstate/raten";

const output = runAllEvaluations(1000);

// Check validation results
console.log("Table 2 matches:", output.validation.table2Match);
console.log("Table 3 matches:", output.validation.table3Match);
console.log("Figures match:", output.validation.figuresMatch);
console.log("Overall:", output.validation.overallMatch);
```

### Tolerance Levels

- **Timing (BTcost, ATT)**: ±15% tolerance
- **Precision/Recall**: ±0.05 absolute tolerance
- **Size Reduction**: ±5 percentage points

## Running Tests

```bash
cd packages/xstate-raten
npm test
```

The evaluation test suite validates:

- Mutant generator correctness
- Trace generation for all modes
- Table 2 result ranges
- Table 3 result ranges
- Figure 4-6 reduction percentages
- Case study state counts

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      run-evaluation.ts                          │
│                    (Main Entry Point)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────────┐
│    Table 2    │  │    Table 3    │  │   Figures 4-6     │
│basic-evaluation│  │compound-eval │  │mregtest-evaluation│
└───────┬───────┘  └───────┬───────┘  └─────────┬─────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   trace-generators.ts │
                │   (Trace Generation)  │
                └───────────┬───────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │  mutant-generators.ts │
                │    (CRF Injection)    │
                └───────────────────────┘
```

## License

MIT
