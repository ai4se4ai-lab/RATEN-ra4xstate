/**
 * Cost Extraction
 * Extracts cost values from XState actions
 */
import type { Configuration, RCStep } from './types';
/**
 * Extract cost from actions
 * Looks for cost values in actions (e.g., setCost(10))
 *
 * @param gamma_P Current PSM configuration
 * @param rc_b BSM RC-step
 * @returns Cost value, or 0 if no cost found
 */
export declare function getCost(gamma_P: Configuration, rc_b: RCStep): number;
//# sourceMappingURL=costExtraction.d.ts.map