/**
 * Provider Telemetry & Cost Estimator Recorder.
 * @module @warborn/runtime/providers/telemetry
 */

import { ProviderTelemetryPayload } from '@warborn/types';

export class ProviderTelemetryRecorder {
  private static readonly history: ProviderTelemetryPayload[] = [];

  /** Cost per 1k tokens in USD based on provider model family */
  private static calculateCost(modelId: string, promptTokens: number, completionTokens: number): number {
    let promptRate = 0.0015; // default $0.0015 / 1k tokens
    let completionRate = 0.002; // default $0.002 / 1k tokens

    if (modelId.includes('titan')) {
      promptRate = 0.0003;
      completionRate = 0.0004;
    } else if (modelId.includes('claude-3-5-sonnet')) {
      promptRate = 0.003;
      completionRate = 0.015;
    } else if (modelId.includes('gpt-4o')) {
      promptRate = 0.0025;
      completionRate = 0.01;
    }

    const inputCost = (promptTokens / 1000) * promptRate;
    const outputCost = (completionTokens / 1000) * completionRate;
    return parseFloat((inputCost + outputCost).toFixed(6));
  }

  public static record(payload: Omit<ProviderTelemetryPayload, 'estimatedCostUsd'>): ProviderTelemetryPayload {
    const estimatedCostUsd = this.calculateCost(payload.modelId, payload.promptTokens, payload.completionTokens);
    const fullTelemetry: ProviderTelemetryPayload = {
      ...payload,
      estimatedCostUsd,
    };

    this.history.push(fullTelemetry);
    if (this.history.length > 500) {
      this.history.shift();
    }

    console.log(`📊 [Provider Telemetry] Provider: ${fullTelemetry.providerId} | Model: ${fullTelemetry.modelId} | Latency: ${fullTelemetry.latencyMs}ms | Tokens: ${fullTelemetry.totalTokens} | Cost: $${fullTelemetry.estimatedCostUsd}`);
    return fullTelemetry;
  }

  public static getHistory(): readonly ProviderTelemetryPayload[] {
    return this.history;
  }
}
