/**
 * Execution Plan Scheduler Subsystem.
 * Converts ExecutionPlan objects from the Planning Engine into scheduled tool executions.
 * @module @warborn/runtime/tools/scheduler
 */

import { ExecutionPlan, ToolExecutionResult } from '@warborn/types';
import { ToolRegistry } from './registry';
import { ToolExecutor } from './executor';

export class ToolExecutionScheduler {
  private readonly executor = new ToolExecutor();

  constructor(private readonly registry: ToolRegistry) {}

  public async scheduleAndExecutePlan(plan: ExecutionPlan): Promise<readonly ToolExecutionResult[]> {
    console.log(`⚡ [ToolExecutionScheduler] Scheduling ExecutionPlan ${plan.planId} (${plan.stages.length} stages)...`);
    const results: ToolExecutionResult[] = [];

    for (const stage of plan.stages) {
      console.log(`📌 [ToolExecutionScheduler] Executing Stage ${stage.stageIndex} (Parallel: ${stage.parallelExecution})...`);

      const tasksToExecute: { tool: any; input: Record<string, unknown> }[] = [];

      for (const step of stage.steps) {
        for (const toolName of step.requiredTools) {
          const tool = this.registry.getTool(toolName);
          if (tool) {
            tasksToExecute.push({
              tool,
              input: { goal: step.description, stepId: step.stepId },
            });
          }
        }
      }

      if (stage.parallelExecution) {
        const stageResults = await this.executor.executeParallel(tasksToExecute);
        results.push(...stageResults);
      } else {
        for (const task of tasksToExecute) {
          const res = await this.executor.executeTool(task.tool, task.input);
          results.push(res);
        }
      }
    }

    return results;
  }
}
