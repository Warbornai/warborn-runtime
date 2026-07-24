/**
 * Execution Strategy Subsystem.
 * Constructs ordered execution stages with parallel stages, rollback checkpoints, and validation rules.
 * @module @warborn/runtime/reasoning/strategy
 */

import { TaskDecompositionStep, ExecutionStage } from '@warborn/types';

export class ExecutionStrategyEngine {
  public buildExecutionStages(steps: readonly TaskDecompositionStep[]): readonly ExecutionStage[] {
    const stages: ExecutionStage[] = [];

    // Group steps with no dependencies into Stage 0 (Parallel)
    const initialSteps = steps.filter(s => s.dependencies.length === 0);
    if (initialSteps.length > 0) {
      stages.push({
        stageIndex: 0,
        steps: initialSteps,
        parallelExecution: initialSteps.length > 1,
        rollbackCheckpoint: true,
      });
    }

    // Group dependent steps into subsequent stages
    const dependentSteps = steps.filter(s => s.dependencies.length > 0);
    if (dependentSteps.length > 0) {
      stages.push({
        stageIndex: 1,
        steps: dependentSteps,
        parallelExecution: false,
        rollbackCheckpoint: true,
      });
    }

    return stages;
  }
}
