/**
 * Agent Subsystem - Registry, Runtime, and Lifecycle Management.
 * @module @warborn/runtime/agents
 */

import { AgentId, AgentConfig, AgentInstance, AgentRole } from '@warborn/types/agent';
import { ISO8601Timestamp } from '@warborn/types/common';

export class AgentRegistry {
  private readonly agents = new Map<AgentId, AgentInstance>();

  public registerAgent(config: AgentConfig): AgentInstance {
    const agentId = config.agentId;
    const instance: AgentInstance = {
      agentId,
      config,
      status: 'idle',
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
