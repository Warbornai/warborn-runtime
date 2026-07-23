"use strict";
/**
 * Agent Subsystem - Registry, Runtime, and Lifecycle Management.
 * @module @warborn/runtime/agents
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRegistry = void 0;
const types_1 = require("@warborn/types");
class AgentRegistry {
    agents = new Map();
    registerAgent(config) {
        const agentId = config.id;
        const instance = {
            agentId,
            config,
            status: types_1.ExecutionStatus.IDLE,
            currentMissionId: undefined,
            lastActiveAt: new Date().toISOString(),
        };
        this.agents.set(agentId, instance);
        return instance;
    }
    getAgent(agentId) {
        return this.agents.get(agentId);
    }
    listAgents() {
        return Array.from(this.agents.values());
    }
}
exports.AgentRegistry = AgentRegistry;
//# sourceMappingURL=index.js.map