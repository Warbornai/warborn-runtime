/**
 * Warborn Brain Orchestration Module.
 * Responsible for reasoning, planning, decision orchestration, task decomposition, and context/provider routing.
 * @module @warborn/runtime/brain
 */
import { BrandedId, ISO8601Timestamp, ChatMessage, ChatResponse, ExecutionPlan } from '@warborn/types';
import { PlatformConfig } from '@warborn/config';
import { PlannerEngine } from '../reasoning';
export interface BrainPlan {
    readonly planId: BrandedId<'PlanId'>;
    readonly goal: string;
    readonly steps: readonly {
        readonly stepId: string;
        readonly description: string;
        readonly assignedAgentRole?: string;
        readonly status: 'pending' | 'in_progress' | 'completed' | 'failed';
    }[];
    readonly createdAt: ISO8601Timestamp;
}
export declare class WarbornBrain {
    private readonly config;
    readonly planner: PlannerEngine;
    constructor(config?: PlatformConfig);
    /** Decompose a high-level goal into an executable multi-step plan */
    decomposeGoal(goal: string): Promise<BrainPlan>;
    /** Create a full Cognitive ExecutionPlan */
    planExecution(goal: string): Promise<ExecutionPlan>;
    /** Orchestrate reasoning and return response using active provider router */
    processReasoningRequest(messages: readonly ChatMessage[]): Promise<ChatResponse>;
}
//# sourceMappingURL=index.d.ts.map