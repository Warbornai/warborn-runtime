/**
 * Master Universal Tool Runtime & Execution Engine Facade for Warborn OS.
 * Orchestrates tool registration, permission checking, policy enforcement, scheduling, and execution.
 * @module @warborn/runtime/tools
 */

import { ITool, ToolExecutionResult, ExecutionPlan, ToolCategory, ISO8601Timestamp } from '@warborn/types';
import { ToolRegistry } from './registry';
import { ToolPermissionValidator } from './permissions';
import { ToolPolicyEngine } from './policies';
import { ToolExecutor } from './executor';
import { ToolExecutionScheduler } from './scheduler';
import { MCPToolClient } from './mcp';
import { ToolTelemetryRecorder } from './telemetry';
import { ReadFileTool, WriteFileTool, SearchCodebaseTool } from './builtin';

export * from './registry';
export * from './permissions';
export * from './policies';
export * from './sandbox';
export * from './mcp';
export * from './executor';
export * from './scheduler';
export * from './telemetry';
export * from './builtin';

export class ToolRuntime {
  public readonly registry = new ToolRegistry();
  public readonly permissionValidator = new ToolPermissionValidator();
  public readonly policyEngine = new ToolPolicyEngine();
  public readonly executor = new ToolExecutor();
  public readonly scheduler: ToolExecutionScheduler;
  public readonly mcpClient = new MCPToolClient();

  constructor() {
    this.scheduler = new ToolExecutionScheduler(this.registry);

    // Register standard built-in system tools
    this.registry.registerTool(new ReadFileTool());
    this.registry.registerTool(new WriteFileTool());
    this.registry.registerTool(new SearchCodebaseTool());
  }

  public registerTool(tool: ITool): void {
    this.registry.registerTool(tool);
  }

  public unregisterTool(toolIdOrName: string): boolean {
    return this.registry.unregisterTool(toolIdOrName);
  }

  public async executeTool(toolIdOrName: string, input: Record<string, unknown>): Promise<ToolExecutionResult> {
    const tool = this.registry.getTool(toolIdOrName);
    if (!tool) {
      return {
        toolId: toolIdOrName as any,
        status: 'failure',
        output: {},
        error: `Tool "${toolIdOrName}" is not registered in ToolRuntime.`,
        latencyMs: 0,
        costUsd: 0,
        timestamp: new Date().toISOString() as ISO8601Timestamp,
      };
    }

    // 1. Permission Validation
    const permCheck = this.permissionValidator.validateToolPermissions(tool);
    if (!permCheck.isAllowed) {
      return {
        toolId: tool.id,
        status: 'failure',
        output: {},
        error: `Permission Denied: Tool ${tool.name} requires missing permissions: ${permCheck.missingPermissions.join(', ')}`,
        latencyMs: 0,
        costUsd: 0,
        timestamp: new Date().toISOString() as ISO8601Timestamp,
      };
    }

    // 2. Policy Enforcement
    const policyCheck = this.policyEngine.evaluatePolicy(tool, input);
    if (!policyCheck.isCompliant) {
      return {
        toolId: tool.id,
        status: 'failure',
        output: {},
        error: `Policy Violation: ${policyCheck.reason}`,
        latencyMs: 0,
        costUsd: 0,
        timestamp: new Date().toISOString() as ISO8601Timestamp,
      };
    }

    // 3. Execution
    const result = await this.executor.executeTool(tool, input);

    // 4. Telemetry Recording
    ToolTelemetryRecorder.record(result);

    return result;
  }

  public async executePlan(plan: ExecutionPlan): Promise<readonly ToolExecutionResult[]> {
    return this.scheduler.scheduleAndExecutePlan(plan);
  }

  public discoverMCPTools(mcpServerUrl: string): readonly ITool[] {
    const discovered = this.mcpClient.discoverRemoteTools(mcpServerUrl);
    for (const tool of discovered) {
      this.registry.registerTool(tool);
    }
    return discovered;
  }

  public listTools(category?: ToolCategory): readonly ITool[] {
    return this.registry.listTools(category);
  }
}
