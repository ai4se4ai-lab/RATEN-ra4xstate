/**
 * Evaluation Tests
 *
 * Tests for the evaluation module to verify actual RATEN analysis produces
 * valid results. All tests check actual computed values, not hardcoded expectations.
 */

import { runBasicEvaluation } from "../evaluation/basic-evaluation";

import { runFullCompoundEvaluation } from "../evaluation/compound-evaluation";

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
    const results = runBasicEvaluation(10); // Small count for fast tests

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

  it("should generate valid metric values", () => {
    const results = runBasicEvaluation(10);

    results.forEach((result) => {
      // Precision should be between 0 and 1
      expect(result.single.precision).toBeGreaterThanOrEqual(0);
      expect(result.single.precision).toBeLessThanOrEqual(1);

      // Recall should be between 0 and 1
      expect(result.single.recall).toBeGreaterThanOrEqual(0);
      expect(result.single.recall).toBeLessThanOrEqual(1);

      // BTcost should be non-negative
      expect(result.single.btCost).toBeGreaterThanOrEqual(0);
      expect(result.sequential.btCost).toBeGreaterThanOrEqual(0);
      expect(result.nested.btCost).toBeGreaterThanOrEqual(0);

      // ATT should be non-negative
      expect(result.single.att).toBeGreaterThanOrEqual(0);
      expect(result.sequential.att).toBeGreaterThanOrEqual(0);
      expect(result.nested.att).toBeGreaterThanOrEqual(0);
    });
  });

  it("should have both Simple and Instrumented levels", () => {
    const results = runBasicEvaluation(10);

    const simpleLevels = results.filter((r) => r.level === "Simple");
    const instrumentedLevels = results.filter(
      (r) => r.level === "Instrumented"
    );

    expect(simpleLevels.length).toBe(12); // 4 models × 3 CRFs
    expect(instrumentedLevels.length).toBe(12); // 4 models × 3 CRFs
  });
});

describe("Compound Evaluation (Table 3)", () => {
  it("should generate results for all models", () => {
    const results = runFullCompoundEvaluation(10);

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

  it("should have valid runtime overhead values", () => {
    const results = runFullCompoundEvaluation(10);

    results.forEach((result) => {
      // Runtime overhead should be positive
      expect(result.avgRuntimeOverhead).toBeGreaterThan(0);

      // CRF count should be 3 (WM, WP, MM)
      expect(result.crfCount).toBe(3);
    });
  });

  it("should have valid precision and recall", () => {
    const results = runFullCompoundEvaluation(10);

    results.forEach((result) => {
      // Sequential mode
      expect(result.sequential.precision).toBeGreaterThanOrEqual(0);
      expect(result.sequential.precision).toBeLessThanOrEqual(1);
      expect(result.sequential.recall).toBeGreaterThanOrEqual(0);
      expect(result.sequential.recall).toBeLessThanOrEqual(1);

      // Nested mode
      expect(result.nested.precision).toBeGreaterThanOrEqual(0);
      expect(result.nested.precision).toBeLessThanOrEqual(1);
      expect(result.nested.recall).toBeGreaterThanOrEqual(0);
      expect(result.nested.recall).toBeLessThanOrEqual(1);
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

  it("should compute valid size reductions", () => {
    const { summaries } = runFullMRegTestEvaluation();

    Object.values(summaries).forEach((summary: any) => {
      // Size reductions should be between 0% and 100%
      expect(summary.singleSizeReduction).toBeGreaterThanOrEqual(0);
      expect(summary.singleSizeReduction).toBeLessThanOrEqual(100);
      expect(summary.sequentialSizeReduction).toBeGreaterThanOrEqual(0);
      expect(summary.sequentialSizeReduction).toBeLessThanOrEqual(100);
      expect(summary.nestedSizeReduction).toBeGreaterThanOrEqual(0);
      expect(summary.nestedSizeReduction).toBeLessThanOrEqual(100);
    });
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

  it("should have non-negative values in figure data", () => {
    const { figures } = runFullMRegTestEvaluation();

    Object.values(figures).forEach((figureData: any) => {
      ["single", "sequential", "nested"].forEach((mode) => {
        figureData[mode].tsMRegTest.forEach((val: number) => {
          expect(val).toBeGreaterThanOrEqual(0);
        });
        figureData[mode].tsRATEN.forEach((val: number) => {
          expect(val).toBeGreaterThanOrEqual(0);
        });
        figureData[mode].exMRegTest.forEach((val: number) => {
          expect(val).toBeGreaterThanOrEqual(0);
        });
        figureData[mode].exRATEN.forEach((val: number) => {
          expect(val).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });
});

describe("Case Studies", () => {
  it("should have correct state counts for simple models", () => {
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
