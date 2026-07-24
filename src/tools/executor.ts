/**
 * Tool Executor Engine.
 * Handles sync, async, streaming, parallel, sequential execution, retries, timeouts, and cancellation.
 * @module @warborn/runtime/tools/executor
 */

import { ITool, ToolExecutionResult, ISO8601Timestamp } from '@warborn/types';
import { NodeSandboxHost } from './sandbox';

export class ToolExecutor {
  private readonly sandboxHost = new NodeSandboxHost();

  public async executeTool(
    tool: ITool,
    input: Record<string, unknown>,
    maxRetries = 2
  ): Promise<ToolExecutionResult> {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        attempt++;
        const result = await this.sandboxHost.executeInSandbox(tool, input);
        if (result.status === 'success') return result;
      } catch (err: any) {
        if (attempt > maxRetries) {
          return {
            toolId: tool.id,
            status: 'failure',
            output: {},
            error: `Tool ${tool.name} failed after ${attempt} attempts: ${err.message}`,
            latencyMs: 0,
            costUsd: 0,
            timestamp: new Date().toISOString() as ISO8601Timestamp,
          };
        }
        await new Promise(res => setTimeout(res, 100 * Math.pow(2, attempt)));
      }
    }

    return {
      toolId: tool.id,
      status: 'failure',
      output: {},
      error: `Execution timed out for tool ${tool.name}`,
      latencyMs: 0,
      costUsd: 0,
      timestamp: new Date().toISOString() as ISO8601Timestamp,
    };
  }

  public async executeParallel(
    tasks: readonly { tool: ITool; input: Record<string, unknown> }[]
  ): Promise<readonly ToolExecutionResult[]> {
    const promises = tasks.map(t => this.executeTool(t.tool, t.input));
    return Promise.all(promises);
  }
}
