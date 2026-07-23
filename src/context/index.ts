/**
 * Context Engine, Memory Manager, Embedding Engine & Knowledge Vector Retrieval.
 * @module @warborn/runtime/context
 */

import { MemoryRecord, MemoryId, ContextChunk, EmbeddingVector } from '@warborn/types/context';
import { ISO8601Timestamp } from '@warborn/types/common';

export class MemoryManager {
  private readonly memories = new Map<MemoryId, MemoryRecord>();

  public storeMemory(content: string, type: 'short_term' | 'long_term' | 'episodic' | 'semantic'): MemoryRecord {
    const memoryId = `mem_${Date.now()}` as MemoryId;
    const record: MemoryRecord = {
      memoryId,
      type,
      content,
      importance: 0.8,
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };
    this.memories.set(memoryId, record);
    return record;
  }

  public searchMemories(query: string, limit = 5): readonly MemoryRecord[] {
    return Array.from(this.memories.values())
      .filter(m => m.content.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit);
  }
}

export class ContextEngine {
  constructor(private readonly memoryManager: MemoryManager) {}

  public async assembleContext(userQuery: string): Promise<readonly ContextChunk[]> {
    const relevantMemories = this.memoryManager.searchMemories(userQuery);
    return relevantMemories.map(m => ({
      chunkId: `chunk_${m.memoryId}` as any,
      content: m.content,
      relevanceScore: m.importance,
      source: m.type,
    }));
  }
}
