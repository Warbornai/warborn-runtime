/**
 * Master Cognitive Reasoning & Planning Engine Facade for Warborn Cortex.
 * Orchestrates the full Cognitive Execution Loop and returns validated ExecutionPlan objects.
 * @module @warborn/runtime/reasoning
 */

import { ExecutionPlan, PlanId, ISO8601Timestamp } from '@warborn/types';
import { IntentEngine } from './intent';
import { GoalModel } from './goals';
import { TaskDecompositor } from './decomposition';
import { ConstraintEngine } from './constraints';
import { RiskEngine } from './risk';
import { ExecutionStrategyEngine } from './strategy';
import { ReasoningEngine } from './reasoning';
import { PlanningReflectionEngine } from './reflection';
import { ReasoningTelemetryRecorder } from './telemetry';

export * from './intent';
export * from './goals';
export * from './decomposition';
export * from './constraints';
export * from './risk';
export * from './strategy';
export * from './reasoning';
export * from './reflection';
export * from './telemetry';

export class PlannerEngine {
  private readonly intentEngine = new IntentEngine();
  private readonly goalModel = new GoalModel();
  private readonly decompositor = new TaskDecompositor();
  private readonly constraintEngine = new ConstraintEngine();
  private readonly riskEngine = new RiskEngine();
  private readonly strategyEngine = new ExecutionStrategyEngine();
  private readonly reasoningEngine = new ReasoningEngine();
  public readonly reflectionEngine = new PlanningReflectionEngine();

  public async createExecutionPlan(userGoal: string): Promise<ExecutionPlan> {
    const startTime = Date.now();
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` as PlanId;

    // 1. Intent Analysis
    const intent = this.intentEngine.analyzeIntent(userGoal);

    // 2. Select Reasoning Mode
    const reasoningMode = this.reasoningEngine.selectReasoningMode(intent);

    // 3. Goal Tree Construction
    const rootGoal = this.goalModel.constructGoalTree(userGoal);

    // 4. Task Decomposition
    const steps = this.decompositor.decomposeGoalTree(rootGoal);

    // 5. Constraint Validation
    const constraintCheck = this.constraintEngine.validateConstraints(steps);
    if (!constraintCheck.isValid) {
      console.warn(`⚠️ [PlannerEngine] Constraint violations detected: ${constraintCheck.violations.join(', ')}`);
    }

    // 6. Risk Evaluation
    const risk = this.riskEngine.evaluateRisk(steps);

    // 7. Execution Strategy Assembly
    const stages = this.strategyEngine.buildExecutionStages(steps);

    const totalEstimatedMs = steps.reduce((acc, s) => acc + s.estimatedEffortMs, 0);
    const planningLatencyMs = Date.now() - startTime;

    const plan: ExecutionPlan = {
      planId,
      goal: userGoal,
      intent,
      reasoningMode,
      rootGoal,
      stages,
      risk,
      totalEstimatedMs,
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };

    // 8. Record Telemetry
    ReasoningTelemetryRecorder.recordPlan({
      planId,
      planningLatencyMs,
      reasoningMode,
      taskCount: steps.length,
      riskScore: risk.failureProbability,
      timestamp: plan.createdAt,
    });

    return plan;
  }
}
