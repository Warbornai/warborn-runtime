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
export declare function getProviderRouter(): ProviderRouter;
export declare class ProviderRegistry {
    private readonly router;
    getBedrockProvider(): BedrockProvider;
    getActiveProvider(type?: any): import("./types").IProvider;
    checkHealth(): Promise<readonly import("./types").ProviderHealth[]>;
}
//# sourceMappingURL=index.d.ts.map