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
export function getCost(gamma_P: Configuration, rc_b: RCStep): number {
  // First, try to get cost from rc_b actions
  const costFromActions = extractCostFromActions(rc_b.actions);
  if (costFromActions !== null) {
    return costFromActions;
  }
  
  // If rc_b has a cost property, use it
  if (rc_b.cost !== undefined) {
    return rc_b.cost;
  }
  
  // Default to 0 if no cost found
  return 0;
}

/**
 * Extract cost value from action objects
 * Supports various formats:
 * - Actions with type containing cost (e.g., "setCost:10")
 * - Actions with cost property
 * - String actions like "setCost(10)"
 */
function extractCostFromActions(actions: any[]): number | null {
  if (!actions || actions.length === 0) {
    return null;
  }
  
  for (const action of actions) {
    // Check if action has a cost property
    if (action && typeof action === 'object' && 'cost' in action) {
      return Number(action.cost) || 0;
    }
    
    // Check action type for cost pattern (e.g., "setCost:10")
    if (action && action.type) {
      const typeStr = String(action.type);
      const costMatch = typeStr.match(/setCost[:\s]*(-?\d+)/i);
      if (costMatch) {
        return Number(costMatch[1]);
      }
      
      // Check for cost in type like "setCost(10)"
      const parenMatch = typeStr.match(/setCost\s*\(\s*(-?\d+)\s*\)/i);
      if (parenMatch) {
        return Number(parenMatch[1]);
      }
    }
    
    // Check if action is a string like "setCost(10)"
    if (typeof action === 'string') {
      const strMatch = action.match(/setCost\s*\(\s*(-?\d+)\s*\)/i);
      if (strMatch) {
        return Number(strMatch[1]);
      }
    }
    
    // Check action.exec if it's a function that might return cost
    if (action && typeof action.exec === 'function') {
      try {
        const result = action.exec();
        if (typeof result === 'number') {
          return result;
        }
      } catch {
        // Ignore errors
      }
    }
  }
  
  return null;
}

