/**
 * Context Engine, Memory Manager, Embedding Engine & Knowledge Vector Retrieval.
 * @module @warborn/runtime/context
 */
import { MemoryRecord, ContextChunk } from '@warborn/types/context';
export declare class MemoryManager {
    private readonly memories;
    storeMemory(content: string, type: 'short_term' | 'long_term' | 'episodic' | 'semantic'): MemoryRecord;
    searchMemories(query: string, limit?: number): readonly MemoryRecord[];
}
export declare class ContextEngine {
    private readonly memoryManager;
    constructor(memoryManager: MemoryManager);
    assembleContext(userQuery: string): Promise<readonly ContextChunk[]>;
}
//# sourceMappingURL=index.d.ts.map