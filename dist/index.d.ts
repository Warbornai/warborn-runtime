/**
 * @warborn/runtime - The Headless Brain & Operating System Kernel for Warborn OS
 * Central Orchestration Engine for Agents, Reasoning, Workflows, Context, Providers, and Events.
 * @packageDocumentation
 */
import { WarbornBrain } from './brain';
import { AgentRegistry } from './agents';
import { MemoryManager, ContextEngine } from './context';
import { ProviderRegistry } from './providers';
import { WorkflowEngine } from './workflow';
import { EventBus } from './events';
import { PolicyEngine } from './security';
import { PlatformConfig } from '@warborn/config';
export * from './brain';
export * from './agents';
export * from './context';
export * from './providers';
export * from './workflow';
export * from './events';
export * from './security';
export declare class WarbornRuntimeEngine {
    readonly brain: WarbornBrain;
    readonly agentRegistry: AgentRegistry;
    readonly memoryManager: MemoryManager;
    readonly contextEngine: ContextEngine;
    readonly providerRegistry: ProviderRegistry;
    readonly workflowEngine: WorkflowEngine;
    readonly eventBus: EventBus;
    readonly policyEngine: PolicyEngine;
    private readonly config;
    constructor(config?: PlatformConfig);
    /** Initialize and start the Warborn Brain Kernel */
    start(): Promise<void>;
}
export declare function getRuntimeEngine(): WarbornRuntimeEngine;
//# sourceMappingURL=index.d.ts.map