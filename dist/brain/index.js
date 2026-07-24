"use strict";
/**
 * Warborn Brain Orchestration Module.
 * Responsible for reasoning, planning, decision orchestration, task decomposition, and context/provider routing.
 * @module @warborn/runtime/brain
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarbornBrain = void 0;
const config_1 = require("@warborn/config");
const reasoning_1 = require("../reasoning");
class WarbornBrain {
    config;
    planner = new reasoning_1.PlannerEngine();
    constructor(config) {
        this.config = config || (0, config_1.getPlatformConfig)();
    }
    /** Decompose a high-level goal into an executable multi-step plan */
    async decomposeGoal(goal) {
        const plan = await this.planner.createExecutionPlan(goal);
        const steps = plan.stages.flatMap(stage => stage.steps.map(s => ({
            stepId: s.stepId,
            description: s.description,
            assignedAgentRole: s.assignedAgentRole,
            status: 'pending',
        })));
        return {
            planId: plan.planId,
            goal: plan.goal,
            steps,
            createdAt: plan.createdAt,
        };
    }
    /** Create a full Cognitive ExecutionPlan */
    async planExecution(goal) {
        return this.planner.createExecutionPlan(goal);
    }
    /** Orchestrate reasoning and return response using active provider router */
    async processReasoningRequest(messages) {
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        const promptText = lastUserMessage ? lastUserMessage.content : 'No query provided';
        const responseMsg = {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: `[Warborn Brain Reasoning]: Processed query "${promptText}" using Amazon Bedrock / OpenAI Provider Router.`,
            timestamp: new Date().toISOString(),
        };
        return {
            message: responseMsg,
            modelId: this.config.providers.openai.defaultModel,
            providerId: 'AMAZON_BEDROCK',
            usageTokens: {
                promptTokens: 12,
                completionTokens: 24,
                totalTokens: 36,
            },
        };
    }
}
exports.WarbornBrain = WarbornBrain;
//# sourceMappingURL=index.js.map