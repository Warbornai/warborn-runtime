"use strict";
/**
 * Context Engine, Memory Manager, Embedding Engine & Knowledge Vector Retrieval.
 * @module @warborn/runtime/context
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextEngine = exports.MemoryManager = void 0;
class MemoryManager {
    memories = new Map();
    storeMemory(content, type) {
        const memoryId = `mem_${Date.now()}`;
        const record = {
            memoryId,
            type,
            content,
            importance: 0.8,
            createdAt: new Date().toISOString(),
        };
        this.memories.set(memoryId, record);
        return record;
    }
    searchMemories(query, limit = 5) {
        return Array.from(this.memories.values())
            .filter(m => m.content.toLowerCase().includes(query.toLowerCase()))
            .slice(0, limit);
    }
}
exports.MemoryManager = MemoryManager;
class ContextEngine {
    memoryManager;
    constructor(memoryManager) {
        this.memoryManager = memoryManager;
    }
    async assembleContext(userQuery) {
        const relevantMemories = this.memoryManager.searchMemories(userQuery);
        return relevantMemories.map(m => ({
            chunkId: `chunk_${m.memoryId}`,
            content: m.content,
            relevanceScore: m.importance,
            source: m.type,
        }));
    }
}
exports.ContextEngine = ContextEngine;
//# sourceMappingURL=index.js.map