/**
 * Tool Execution Telemetry & Performance Tracker.
 * @module @warborn/runtime/tools/telemetry
 */

import { ToolExecutionResult } from '@warborn/types';

export class ToolTelemetryRecorder {
  private static readonly history: ToolExecutionResult[] = [];

  public static record(result: ToolExecutionResult): void {
    this.history.push(result);
    console.log(`📊 [Tool Telemetry] Tool: ${result.toolId} | Status: ${result.status} | Latency: ${result.latencyMs}ms | Cost: $${result.costUsd}`);
  }

  public static getHistory(): readonly ToolExecutionResult[] {
    return this.history;
  }
}
