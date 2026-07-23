/**
 * Multi-Provider AI Routing and Fallback Engine.
 * @module @warborn/runtime/providers
 */

import { ProviderConfig, ProviderType } from '@warborn/types/provider';
import { getPlatformConfig } from '@warborn/config';

export class ProviderRegistry {
  private readonly providers = new Map<ProviderType, ProviderConfig>();

  constructor() {
    const platformConfig = getPlatformConfig();
    this.registerFromConfig(platformConfig);
  }

  private registerFromConfig(config: any): void {
    if (config.providers.openai.enabled) {
      this.providers.set('openai', {
        providerId: 'openai' as any,
        name: 'OpenAI',
        type: 'openai',
        baseUrl: config.providers.openai.baseUrl,
        enabled: true,
        capabilities: { text: true, streaming: true, functionCalling: true, vision: true, audio: false },
      });
    }
  }

  public getProvider(type: ProviderType): ProviderConfig | undefined {
    return this.providers.get(type);
  }
}
