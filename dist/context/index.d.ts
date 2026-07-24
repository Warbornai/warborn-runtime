/**
 * Cortex Context Intelligence Engine - Master Assembly Facade.
 * @module @warborn/runtime/context
 */
import { ContextBundle, IContextProvider, MemoryRecord, MemoryType } from '@warborn/types';
export * from './providers';
export * from './ranker';
export * from './budget';
export * from './prompt';
export * from './cache';
export declare class MemoryManager {
    private readonly memories;
    storeMemory(content: string, type: MemoryType): MemoryRecord;
    searchMemories(query: string, limit?: number): readonly MemoryRecord[];
}
export declare class ContextEngine {
    readonly memoryManager?: MemoryManager | undefined;
    private readonly providers;
    private readonly cache;
    private readonly budgetManager;
    constructor(memoryManager?: MemoryManager | undefined);
    registerProvider(provider: IContextProvider): void;
    generateContextBundle(userQuery: string, options?: Record<string, unknown>): Promise<ContextBundle>;
}
//# sourceMappingURL=index.d.ts.map