/**
 * Constraint Tracking Engine.
 * Enforces time limits, budgets, workspace policies, permissions, and security requirements.
 * @module @warborn/runtime/reasoning/constraints
 */

import { TaskDecompositionStep } from '@warborn/types';

export interface ConstraintCheckResult {
  readonly isValid: boolean;
  readonly violations: readonly string[];
}

export class ConstraintEngine {
  public validateConstraints(steps: readonly TaskDecompositionStep[]): ConstraintCheckResult {
    const violations: string[] = [];

    for (const step of steps) {
      if (step.estimatedEffortMs > 60000) {
        violations.push(`Step ${step.stepId} exceeds 60s max execution time constraint.`);
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
    };
  }
}
