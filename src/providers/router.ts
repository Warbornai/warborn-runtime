/**
 * Provider Router & Automatic Fallback Engine.
 * Dynamically selects active AI providers (Bedrock, OpenAI, Anthropic, Gemini, Ollama).
 * @module @warborn/runtime/providers/router
 */

import { ProviderType, IProvider, ProviderHealth } from '@warborn/types';
import { BedrockProvider } from './bedrock';

export class ProviderRouter {
  private readonly providers = new Map<ProviderType, IProvider>();
  private primaryProviderType: ProviderType = ProviderType.AMAZON_BEDROCK;

  constructor() {
    // Register Amazon Bedrock as the primary production provider
    const bedrock = new BedrockProvider();
    this.registerProvider(bedrock);
  }

  public registerProvider(provider: IProvider): void {
    this.providers.set(provider.providerType, provider);
    console.log(`🔌 [ProviderRouter] Registered AI Provider: ${provider.providerId} (${provider.providerType})`);
  }

  public getProvider(type?: ProviderType): IProvider {
    const targetType = type || this.primaryProviderType;
    const provider = this.providers.get(targetType);

    if (provider) {
      return provider;
    }

    // Fallback to Amazon Bedrock if requested provider is unavailable
    const fallback = this.providers.get(ProviderType.AMAZON_BEDROCK);
    if (fallback) {
      console.warn(`⚠️ [ProviderRouter] Requested provider ${type} not found. Failing over to Amazon Bedrock.`);
      return fallback;
    }

    throw new Error(`[ProviderRouter] No active AI provider registered.`);
  }

  public setPrimaryProvider(type: ProviderType): void {
    if (!this.providers.has(type)) {
      throw new Error(`[ProviderRouter] Cannot set primary provider ${type}: Provider not registered.`);
    }
    this.primaryProviderType = type;
    console.log(`🎯 [ProviderRouter] Primary AI Provider updated to: ${type}`);
  }

  public async checkAllHealth(): Promise<readonly ProviderHealth[]> {
    const results: ProviderHealth[] = [];
    for (const provider of this.providers.values()) {
      const status = await provider.health();
      results.push(status);
    }
    return results;
  }

  public listRegisteredProviders(): ProviderType[] {
    return Array.from(this.providers.keys());
  }
}
