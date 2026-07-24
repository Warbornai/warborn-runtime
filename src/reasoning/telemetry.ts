/**
 * Reasoning & Planning Telemetry Tracker.
 * @module @warborn/runtime/reasoning/telemetry
 */

export interface ReasoningMetricsPayload {
  readonly planId: string;
  readonly planningLatencyMs: number;
  readonly reasoningMode: string;
  readonly taskCount: number;
  readonly riskScore: number;
  readonly timestamp: string;
}

export class ReasoningTelemetryRecorder {
  private static readonly planHistory: ReasoningMetricsPayload[] = [];

  public static recordPlan(payload: ReasoningMetricsPayload): void {
    this.planHistory.push(payload);
    console.log(`📊 [Reasoning Telemetry] Plan: ${payload.planId} | Mode: ${payload.reasoningMode} | Tasks: ${payload.taskCount} | Risk: ${payload.riskScore} | Latency: ${payload.planningLatencyMs}ms`);
  }
}
