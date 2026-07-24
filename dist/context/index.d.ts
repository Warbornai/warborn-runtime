/**
 * Cortex Context Intelligence Engine - Master Assembly Facade.
 * @module @warborn/runtime/context
 */
import { ContextBundle, IContextProvider } from '@warborn/types';
export * from './providers';
export * from './ranker';
export * from './budget';
export * from './prompt';
export * from './cache';
export declare class ContextEngine {
    readonly memoryManager?: any | undefined;
    private readonly providers;
    private readonly cache;
    private readonly budgetManager;
    constructor(memoryManager?: any | undefined);
    registerProvider(provider: IContextProvider): void;
    generateContextBundle(userQuery: string, options?: Record<string, unknown>): Promise<ContextBundle>;
}
//# sourceMappingURL=index.d.ts.map