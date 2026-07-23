/**
 * Context Engine, Memory Manager, Embedding Engine & Knowledge Vector Retrieval.
 * @module @warborn/runtime/context
 */
import { MemoryRecord, ContextChunk, MemoryType } from '@warborn/types';
export declare class MemoryManager {
    private readonly memories;
    storeMemory(content: string, type: MemoryType): MemoryRecord;
    searchMemories(query: string, limit?: number): readonly MemoryRecord[];
}
export declare class ContextEngine {
    private readonly memoryManager;
    constructor(memoryManager: MemoryManager);
    assembleContext(userQuery: string): Promise<readonly ContextChunk[]>;
}
//# sourceMappingURL=index.d.ts.map