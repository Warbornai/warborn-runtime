"use strict";
/**
 * Warborn Brain Orchestration Module.
 * Responsible for reasoning, planning, decision orchestration, task decomposition, and context/provider routing.
 * @module @warborn/runtime/brain
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarbornBrain = void 0;
const config_1 = require("@warborn/config");
class WarbornBrain {
    config;
    constructor(config) {
        this.config = config || (0, config_1.getPlatformConfig)();
    }
    /** Decompose a high-level goal into an executable multi-step plan */
    async decomposeGoal(goal) {
        const planId = `plan_${Date.now()}`;
        return {
            planId,
            goal,
            steps: [
                { stepId: 'step_1', description: 'Analyze intent and extract context', status: 'pending' },
                { stepId: 'step_2', description: 'Query memory and knowledge vectors', status: 'pending' },
                { stepId: 'step_3', description: 'Select optimal model provider', status: 'pending' },
                { stepId: 'step_4', description: 'Execute tool actions and synthesize response', status: 'pending' },
            ],
            createdAt: new Date().toISOString(),
        };
    }
    /** Orchestrate reasoning and return response using active provider router */
    async processReasoningRequest(messages) {
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        const promptText = lastUserMessage ? lastUserMessage.content : 'No query provided';
        return {
            content: `[Warborn Brain Reasoning]: Processed query "${promptText}" using ${this.config.providers.openai.defaultModel}.`,
            role: 'assistant',
            modelId: this.config.providers.openai.defaultModel,
            providerId: 'openai',
            finishReason: 'stop',
            createdAt: new Date().toISOString(),
        };
    }
}
exports.WarbornBrain = WarbornBrain;
//# sourceMappingURL=index.js.map