/**
 * Multi-Provider AI Routing and Fallback Engine for Warborn OS.
 * @module @warborn/runtime/providers
 */

export * from './types';
export * from './middleware';
export * from './telemetry';
export * from './bedrock';
export * from './router';

import { ProviderRouter } from './router';
import { BedrockProvider } from './bedrock';

let cachedRouter: ProviderRouter | null = null;

export function getProviderRouter(): ProviderRouter {
  if (!cachedRouter) {
    cachedRouter = new ProviderRouter();
  }
  return cachedRouter;
}

export class ProviderRegistry {
  private readonly router = getProviderRouter();

  public getBedrockProvider(): BedrockProvider {
    return this.router.getProvider(BedrockProvider.prototype.providerType as any) as BedrockProvider;
  }

  public getActiveProvider(type?: any) {
    return this.router.getProvider(type);
  }

  public async checkHealth() {
    return this.router.checkAllHealth();
  }
}
