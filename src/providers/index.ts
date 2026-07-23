/**
 * Multi-Provider AI Routing and Fallback Engine.
 * @module @warborn/runtime/providers
 */

import { ProviderConfig, ProviderType } from '@warborn/types';
import { getPlatformConfig } from '@warborn/config';

export class ProviderRegistry {
  private readonly providers = new Map<ProviderType, ProviderConfig>();

  constructor() {
    const platformConfig = getPlatformConfig();
    this.registerFromConfig(platformConfig);
  }

  private registerFromConfig(config: any): void {
    if (config.providers.openai.enabled) {
      this.providers.set(ProviderType.OPENAI, {
        providerId: ProviderType.OPENAI as any,
        name: 'OpenAI',
        type: ProviderType.OPENAI,
        baseUrl: config.providers.openai.baseUrl,
        enabled: true,
        capabilities: { streaming: true, functionCalling: true, vision: true },
      } as any);
    }
  }

  public getProvider(type: ProviderType): ProviderConfig | undefined {
    return this.providers.get(type);
  }
}
