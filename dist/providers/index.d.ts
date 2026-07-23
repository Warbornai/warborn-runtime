/**
 * Multi-Provider AI Routing and Fallback Engine.
 * @module @warborn/runtime/providers
 */
import { ProviderConfig, ProviderType } from '@warborn/types/provider';
export declare class ProviderRegistry {
    private readonly providers;
    constructor();
    private registerFromConfig;
    getProvider(type: ProviderType): ProviderConfig | undefined;
}
//# sourceMappingURL=index.d.ts.map