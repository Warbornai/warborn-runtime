/**
 * Task Decomposition & Dependency Graph Subsystem.
 * Splits complex goals into executable steps, detects dependencies, and computes critical paths.
 * @module @warborn/runtime/reasoning/decomposition
 */

import { GoalNode, TaskDecompositionStep } from '@warborn/types';

export class TaskDecompositor {
  public decomposeGoalTree(rootGoal: GoalNode): readonly TaskDecompositionStep[] {
    const steps: TaskDecompositionStep[] = [];

    let stepCounter = 1;
    for (const subGoal of rootGoal.subGoals) {
      const stepId = `step_${stepCounter++}`;
      const dependencies = steps.length > 0 ? [steps[steps.length - 1].stepId] : [];

      steps.push({
        stepId,
        description: subGoal.title,
        dependencies,
        estimatedEffortMs: 500 * stepCounter,
        criticalPath: stepCounter === 1 || stepCounter === rootGoal.subGoals.length,
        assignedAgentRole: this.selectRoleForTask(subGoal.title),
        requiredTools: this.selectToolsForTask(subGoal.title),
      });
    }

    return steps;
  }

  private selectRoleForTask(title: string): string {
    const tLower = title.toLowerCase();
    if (tLower.includes('code') || tLower.includes('build')) return 'CODER';
    if (tLower.includes('deploy') || tLower.includes('cloud')) return 'ORCHESTRATOR';
    if (tLower.includes('audit') || tLower.includes('security')) return 'SECURITY_AUDITOR';
    return 'RESEARCHER';
  }

  private selectToolsForTask(title: string): readonly string[] {
    const tLower = title.toLowerCase();
    if (tLower.includes('code')) return ['read_file', 'write_to_file'];
    if (tLower.includes('audit')) return ['search_codebase', 'policy_check'];
    return ['query_memory', 'context_generate'];
  }
}
