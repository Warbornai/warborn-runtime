/**
 * Warborn Brain Orchestration Module.
 * Responsible for reasoning, planning, decision orchestration, task decomposition, and context/provider routing.
 * @module @warborn/runtime/brain
 */

import { BrandedId, ISO8601Timestamp } from '@warborn/types/common';
import { AgentConfig } from '@warborn/types/agent';
import { ChatMessage, ChatResponse } from '@warborn/types/chat';
import { PlatformConfig, getPlatformConfig } from '@warborn/config';

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

export class WarbornBrain {
  private readonly config: PlatformConfig;

  constructor(config?: PlatformConfig) {
    this.config = config || getPlatformConfig();
  }

  /** Decompose a high-level goal into an executable multi-step plan */
  public async decomposeGoal(goal: string): Promise<BrainPlan> {
    const planId = `plan_${Date.now()}` as BrandedId<'PlanId'>;
    return {
      planId,
      goal,
      steps: [
        { stepId: 'step_1', description: 'Analyze intent and extract context', status: 'pending' },
        { stepId: 'step_2', description: 'Query memory and knowledge vectors', status: 'pending' },
        { stepId: 'step_3', description: 'Select optimal model provider', status: 'pending' },
        { stepId: 'step_4', description: 'Execute tool actions and synthesize response', status: 'pending' },
      ],
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };
  }

  /** Orchestrate reasoning and return response using active provider router */
  public async processReasoningRequest(messages: readonly ChatMessage[]): Promise<ChatResponse> {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const promptText = lastUserMessage ? lastUserMessage.content : 'No query provided';

    return {
      messageId: `msg_${Date.now()}` as BrandedId<'MessageId'>,
      content: `[Warborn Brain Reasoning]: Processed query "${promptText}" using ${this.config.providers.openai.defaultModel}.`,
      role: 'assistant',
      modelId: this.config.providers.openai.defaultModel,
      providerId: 'openai',
      finishReason: 'stop',
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };
  }
}
