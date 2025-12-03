/**
 * Case Studies Index
 * Exports all behavioral state machines (BSM) and property state machines (PSM) for RATEN evaluation
 */

export * from "./simple-models";
export * from "./instrumented-models";
export * from "./property-models";

import { simpleModelsMetadata, SimpleModelKey } from "./simple-models";
import {
  instrumentedModelsMetadata,
  InstrumentedModelKey,
} from "./instrumented-models";
import { propertyModelsMetadata, PropertyModelKey } from "./property-models";

// Combined metadata for all models
export const allModelsMetadata = {
  ...simpleModelsMetadata,
  ...instrumentedModelsMetadata,
};

export type ModelKey = SimpleModelKey | InstrumentedModelKey;

// Model categories
export const simpleModelKeys: SimpleModelKey[] = ["CM", "PR", "RO", "FO"];
export const instrumentedModelKeys: InstrumentedModelKey[] = [
  "RCM",
  "RPR",
  "RRO",
  "RFO",
];
export const allModelKeys: ModelKey[] = [
  ...simpleModelKeys,
  ...instrumentedModelKeys,
];

/**
 * Get model metadata by key
 */
export function getModelMetadata(key: ModelKey) {
  return allModelsMetadata[key];
}

/**
 * Get all simple models
 */
export function getSimpleModels() {
  return simpleModelKeys.map((key) => ({
    key,
    ...simpleModelsMetadata[key],
  }));
}

/**
 * Get all instrumented models
 */
export function getInstrumentedModels() {
  return instrumentedModelKeys.map((key) => ({
    key,
    ...instrumentedModelsMetadata[key],
  }));
}

/**
 * Get all models
 */
export function getAllModels() {
  return allModelKeys.map((key) => ({
    key,
    ...allModelsMetadata[key],
  }));
}
