/**
 * Evaluation Tests
 *
 * Tests for the evaluation module to ensure results match paper values
 */

import {
  runBasicEvaluation,
  EXPECTED_RESULTS_TABLE2,
} from "../evaluation/basic-evaluation";

import {
  runFullCompoundEvaluation,
  EXPECTED_RESULTS_TABLE3,
} from "../evaluation/compound-evaluation";

import {
  runFullMRegTestEvaluation,
  calculateFigureSummary,
} from "../evaluation/mregtest-evaluation";

import {
  generateMutant,
  generateWMmutant,
  generateWPmutant,
  generateMMmutant,
} from "../evaluation/mutant-generators";

import { generateTraces, MODEL_EVENTS } from "../evaluation/trace-generators";

describe("Mutant Generators", () => {
  const sampleTraces = [
    { event: "START", message: { data: "test1" } },
    { event: "PROCESS", message: { data: "test2" } },
    { event: "COMPLETE", message: { data: "test3" } },
  ];

  it("should generate WM (Wrong Message) mutants", () => {
    const result = generateWMmutant(sampleTraces, {
      injectionPositions: [1],
    });

    expect(result.crfType).toBe("WM");
    expect(result.injectionPoints).toContain(1);
    expect(result.mutatedTrace[1].event).not.toBe("PROCESS");
    expect(result.expectedBadState).toBe(true);
  });

  it("should generate WP (Wrong Payload) mutants", () => {
    const result = generateWPmutant(sampleTraces, {
      injectionPositions: [0],
    });

    expect(result.crfType).toBe("WP");
    expect(result.injectionPoints).toContain(0);
    expect(result.mutatedTrace[0].message.__mutated).toBe(true);
    expect(result.expectedBadState).toBe(true);
  });

  it("should generate MM (Missing Message) mutants", () => {
    const result = generateMMmutant(sampleTraces, {
      injectionPositions: [2],
    });

    expect(result.crfType).toBe("MM");
    expect(result.injectionPoints).toContain(2);
    expect(result.mutatedTrace[2].event).toBe("TIMEOUT");
    expect(result.expectedBadState).toBe(true);
  });

  it("should generate mutants by CRF type", () => {
    const wmResult = generateMutant(sampleTraces, "WM");
    const wpResult = generateMutant(sampleTraces, "WP");
    const mmResult = generateMutant(sampleTraces, "MM");

    expect(wmResult.crfType).toBe("WM");
    expect(wpResult.crfType).toBe("WP");
    expect(mmResult.crfType).toBe("MM");
  });
});

describe("Trace Generators", () => {
  it("should generate traces for Single mode", () => {
    const traceSet = generateTraces({
      traceCount: 100,
      mode: "Single",
      strategy: "Basic",
      crfTypes: ["WM"],
    });

    expect(traceSet.traces.length).toBe(100);
    expect(traceSet.mutatedTraces.length).toBe(100);
    expect(traceSet.metadata.executionMode).toBe("Single");
    expect(traceSet.metadata.strategy).toBe("Basic");
  });

  it("should generate traces for Sequential mode", () => {
    const traceSet = generateTraces({
      traceCount: 50,
      mode: "Sequential",
      strategy: "Basic",
      crfTypes: ["WP"],
    });

    expect(traceSet.traces.length).toBe(50);
    expect(traceSet.metadata.executionMode).toBe("Sequential");
  });

  it("should generate traces for Nested mode", () => {
    const traceSet = generateTraces({
      traceCount: 50,
      mode: "Nested",
      strategy: "Basic",
      crfTypes: ["MM"],
    });

    expect(traceSet.traces.length).toBe(50);
    expect(traceSet.metadata.executionMode).toBe("Nested");
  });

  it("should generate traces with Compound strategy", () => {
    const traceSet = generateTraces({
      traceCount: 50,
      mode: "Single",
      strategy: "Compound",
      crfTypes: ["WM", "WP", "MM"],
    });

    expect(traceSet.metadata.strategy).toBe("Compound");
  });

  it("should use model-specific events", () => {
    const cmEvents = MODEL_EVENTS["CM"];
    expect(cmEvents.normal).toContain("EDIT");
    expect(cmEvents.recovery).toContain("RECOVER");

    const foEvents = MODEL_EVENTS["FO"];
    expect(foEvents.normal).toContain("POWER_ON");
  });
});

describe("Basic Evaluation (Table 2)", () => {
  it("should generate results for all models and CRF types", () => {
    const results = runBasicEvaluation(100);

    // Should have 8 models × 3 CRF types = 24 entries
    expect(results.length).toBe(24);

    // Check structure
    const firstResult = results[0];
    expect(firstResult).toHaveProperty("level");
    expect(firstResult).toHaveProperty("crfType");
    expect(firstResult).toHaveProperty("model");
    expect(firstResult).toHaveProperty("single");
    expect(firstResult).toHaveProperty("sequential");
    expect(firstResult).toHaveProperty("nested");
  });

  it("should generate results within expected ranges", () => {
    const results = runBasicEvaluation(100);

    results.forEach((result) => {
      // Precision should be between 0.77 and 1.00
      expect(result.single.precision).toBeGreaterThanOrEqual(0.7);
      expect(result.single.precision).toBeLessThanOrEqual(1.0);

      // Recall should be between 0.74 and 1.00
      expect(result.single.recall).toBeGreaterThanOrEqual(0.7);
      expect(result.single.recall).toBeLessThanOrEqual(1.0);

      // BTcost should be positive
      expect(result.single.btCost).toBeGreaterThan(0);
      expect(result.sequential.btCost).toBeGreaterThan(0);
      expect(result.nested.btCost).toBeGreaterThan(0);
    });
  });

  it("should have expected results for all models", () => {
    const modelKeys = ["CM", "PR", "RO", "FO", "RCM", "RPR", "RRO", "RFO"];

    modelKeys.forEach((key) => {
      expect(EXPECTED_RESULTS_TABLE2[key]).toBeDefined();
      expect(EXPECTED_RESULTS_TABLE2[key]["WM"]).toBeDefined();
      expect(EXPECTED_RESULTS_TABLE2[key]["WP"]).toBeDefined();
      expect(EXPECTED_RESULTS_TABLE2[key]["MM"]).toBeDefined();
    });
  });
});

describe("Compound Evaluation (Table 3)", () => {
  it("should generate results for all models", () => {
    const results = runFullCompoundEvaluation(100);

    // Should have 8 models
    expect(results.length).toBe(8);

    // Check structure
    const firstResult = results[0];
    expect(firstResult).toHaveProperty("level");
    expect(firstResult).toHaveProperty("model");
    expect(firstResult).toHaveProperty("sequential");
    expect(firstResult).toHaveProperty("nested");
    expect(firstResult).toHaveProperty("avgRuntimeOverhead");
    expect(firstResult).toHaveProperty("crfCount");
  });

  it("should have runtime overhead between 1.02 and 1.28", () => {
    const results = runFullCompoundEvaluation(100);

    results.forEach((result) => {
      expect(result.avgRuntimeOverhead).toBeGreaterThanOrEqual(1.02);
      expect(result.avgRuntimeOverhead).toBeLessThanOrEqual(1.28);
    });
  });

  it("should have expected results for all models", () => {
    const modelKeys = ["CM", "PR", "RO", "FO", "RCM", "RPR", "RRO", "RFO"];

    modelKeys.forEach((key) => {
      expect(EXPECTED_RESULTS_TABLE3[key]).toBeDefined();
      expect(EXPECTED_RESULTS_TABLE3[key].sequential).toBeDefined();
      expect(EXPECTED_RESULTS_TABLE3[key].nested).toBeDefined();
      expect(EXPECTED_RESULTS_TABLE3[key].avgROver).toBeDefined();
    });
  });
});

describe("MRegTest Evaluation (Figures 4-6)", () => {
  it("should generate data for all CRF types", () => {
    const { figures, summaries } = runFullMRegTestEvaluation();

    expect(figures.WM).toBeDefined();
    expect(figures.WP).toBeDefined();
    expect(figures.MM).toBeDefined();

    expect(summaries.WM).toBeDefined();
    expect(summaries.WP).toBeDefined();
    expect(summaries.MM).toBeDefined();
  });

  it("should have expected test suite reduction for WM", () => {
    const { summaries } = runFullMRegTestEvaluation();
    const wmSummary = summaries.WM;

    // Expected: Single 17%, Sequential 62%, Nested 59%
    expect(Math.abs(wmSummary.singleSizeReduction - 17)).toBeLessThanOrEqual(5);
    expect(
      Math.abs(wmSummary.sequentialSizeReduction - 62)
    ).toBeLessThanOrEqual(5);
    expect(Math.abs(wmSummary.nestedSizeReduction - 59)).toBeLessThanOrEqual(5);
  });

  it("should have expected test suite reduction for WP", () => {
    const { summaries } = runFullMRegTestEvaluation();
    const wpSummary = summaries.WP;

    // Expected: Single 19%, Sequential 37%, Nested 78%
    expect(Math.abs(wpSummary.singleSizeReduction - 19)).toBeLessThanOrEqual(5);
    expect(
      Math.abs(wpSummary.sequentialSizeReduction - 37)
    ).toBeLessThanOrEqual(5);
    expect(Math.abs(wpSummary.nestedSizeReduction - 78)).toBeLessThanOrEqual(5);
  });

  it("should have expected test suite reduction for MM", () => {
    const { summaries } = runFullMRegTestEvaluation();
    const mmSummary = summaries.MM;

    // Expected: Single 43%, Sequential 54%, Nested 77%
    expect(Math.abs(mmSummary.singleSizeReduction - 43)).toBeLessThanOrEqual(5);
    expect(
      Math.abs(mmSummary.sequentialSizeReduction - 54)
    ).toBeLessThanOrEqual(5);
    expect(Math.abs(mmSummary.nestedSizeReduction - 77)).toBeLessThanOrEqual(5);
  });

  it("should have proper figure data structure", () => {
    const { figures } = runFullMRegTestEvaluation();

    const wmData = figures.WM;
    expect(wmData.traceCounts).toHaveLength(6);
    expect(wmData.single.tsMRegTest).toHaveLength(6);
    expect(wmData.single.tsRATEN).toHaveLength(6);
    expect(wmData.single.exMRegTest).toHaveLength(6);
    expect(wmData.single.exRATEN).toHaveLength(6);
  });
});

describe("Case Studies", () => {
  it("should have correct state counts for simple models", () => {
    // Import at test time to avoid circular dependency issues
    const { simpleModelsMetadata } = require("../case-studies/simple-models");

    expect(simpleModelsMetadata.CM.stateCount).toBe(7);
    expect(simpleModelsMetadata.PR.stateCount).toBe(25);
    expect(simpleModelsMetadata.RO.stateCount).toBe(32);
    expect(simpleModelsMetadata.FO.stateCount).toBe(49);
  });

  it("should have correct state counts for instrumented models", () => {
    const {
      instrumentedModelsMetadata,
    } = require("../case-studies/instrumented-models");

    expect(instrumentedModelsMetadata.RCM.stateCount).toBe(25);
    expect(instrumentedModelsMetadata.RPR.stateCount).toBe(68);
    expect(instrumentedModelsMetadata.RRO.stateCount).toBe(1043);
    expect(instrumentedModelsMetadata.RFO.stateCount).toBe(2364);
  });
});
