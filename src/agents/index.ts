/**
 * Agent Subsystem - Registry, Runtime, and Lifecycle Management.
 * @module @warborn/runtime/agents
 */

import { AgentId, AgentConfig, AgentInstance, ISO8601Timestamp, ExecutionStatus } from '@warborn/types';

export class AgentRegistry {
  private readonly agents = new Map<AgentId, AgentInstance>();

  public registerAgent(config: AgentConfig): AgentInstance {
    const agentId = config.id;
    const instance: AgentInstance = {
      agentId,
      config,
      status: ExecutionStatus.IDLE,
      currentMissionId: undefined,
      lastActiveAt: new Date().toISOString() as ISO8601Timestamp,
    };
    this.agents.set(agentId, instance);
    return instance;
  }

  public getAgent(agentId: AgentId): AgentInstance | undefined {
    return this.agents.get(agentId);
  }

  public listAgents(): readonly AgentInstance[] {
    return Array.from(this.agents.values());
  }
}
