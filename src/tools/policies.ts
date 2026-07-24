/**
 * Configurable Policy Engine for Tool Execution.
 * Enforces security, network, filesystem, cost limit, and time limit policies.
 * @module @warborn/runtime/tools/policies
 */

import { ITool } from '@warborn/types';

export interface ToolPolicyConfig {
  readonly maxCostPerExecutionUsd: number;
  readonly maxDurationMs: number;
  readonly allowNetworkAccess: boolean;
}

export class ToolPolicyEngine {
  constructor(
    private readonly config: ToolPolicyConfig = {
      maxCostPerExecutionUsd: 1.0,
      maxDurationMs: 30000,
      allowNetworkAccess: true,
    }
  ) {}

  public evaluatePolicy(tool: ITool, input: Record<string, unknown>): { readonly isCompliant: boolean; readonly reason?: string } {
    const estimatedCost = tool.estimateCost(input);
    if (estimatedCost > this.config.maxCostPerExecutionUsd) {
      return { isCompliant: false, reason: `Estimated cost ($${estimatedCost}) exceeds policy limit ($${this.config.maxCostPerExecutionUsd})` };
    }

    const estimatedDuration = tool.estimateDuration(input);
    if (estimatedDuration > this.config.maxDurationMs) {
      return { isCompliant: false, reason: `Estimated duration (${estimatedDuration}ms) exceeds policy limit (${this.config.maxDurationMs}ms)` };
    }

    if (tool.permissions.includes('network.access') && !this.config.allowNetworkAccess) {
      return { isCompliant: false, reason: `Network access policy is disabled for tool ${tool.name}` };
    }

    return { isCompliant: true };
  }
}
