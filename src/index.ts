/**
 * @warborn/runtime - The Headless Brain & Operating System Kernel for Warborn OS
 * Central Orchestration Engine for Agents, Reasoning, Workflows, Context, Providers, Memory, and Events.
 * @packageDocumentation
 */

import { WarbornBrain } from './brain';
import { AgentRegistry } from './agents';
import { ContextEngine } from './context';
import { MemoryEngine } from './memory';
import { ProviderRegistry } from './providers';
import { WorkflowEngine } from './workflow';
import { EventBus } from './events';
import { PolicyEngine } from './security';
import { PlatformConfig, getPlatformConfig } from '@warborn/config';

export * from './brain';
export * from './agents';
export * from './context';
export * from './memory';
export * from './reasoning';
export * from './providers';
export * from './workflow';
export * from './events';
export * from './security';

export class WarbornRuntimeEngine {
  public readonly brain: WarbornBrain;
  public readonly agentRegistry: AgentRegistry;
  public readonly memoryManager: MemoryEngine;
  public readonly contextEngine: ContextEngine;
  public readonly providerRegistry: ProviderRegistry;
  public readonly workflowEngine: WorkflowEngine;
  public readonly eventBus: EventBus;
  public readonly policyEngine: PolicyEngine;
  private readonly config: PlatformConfig;

  constructor(config?: PlatformConfig) {
    this.config = config || getPlatformConfig();
    this.brain = new WarbornBrain(this.config);
    this.agentRegistry = new AgentRegistry();
    this.memoryManager = new MemoryEngine();
    this.contextEngine = new ContextEngine(this.memoryManager as any);
    this.providerRegistry = new ProviderRegistry();
    this.workflowEngine = new WorkflowEngine();
    this.eventBus = new EventBus();
    this.policyEngine = new PolicyEngine();
  }

  /** Initialize and start the Warborn Brain Kernel */
  public async start(): Promise<void> {
    await this.eventBus.publish('system:initialized' as any, {
      message: 'Warborn Headless Brain Engine started successfully.',
      environment: this.config.environment.mode,
    });
  }
}

let cachedRuntime: WarbornRuntimeEngine | null = null;

export function getRuntimeEngine(): WarbornRuntimeEngine {
  if (!cachedRuntime) {
    cachedRuntime = new WarbornRuntimeEngine();
  }
  return cachedRuntime;
}
