/**
 * Agent Subsystem - Registry, Runtime, and Lifecycle Management.
 * @module @warborn/runtime/agents
 */
import { AgentId, AgentConfig, AgentInstance } from '@warborn/types';
export declare class AgentRegistry {
    private readonly agents;
    registerAgent(config: AgentConfig): AgentInstance;
    getAgent(agentId: AgentId): AgentInstance | undefined;
    listAgents(): readonly AgentInstance[];
}
//# sourceMappingURL=index.d.ts.map