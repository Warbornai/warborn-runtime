/**
 * Context Engine, Memory Manager, Embedding Engine & Knowledge Vector Retrieval.
 * @module @warborn/runtime/context
 */

import { MemoryRecord, MemoryId, ContextChunk, ISO8601Timestamp, MemoryType } from '@warborn/types';

export class MemoryManager {
  private readonly memories = new Map<MemoryId, MemoryRecord>();

  public storeMemory(content: string, type: MemoryType): MemoryRecord {
    const id = `mem_${Date.now()}` as MemoryId;
    const record: MemoryRecord = {
      id,
      type,
      content,
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    } as any;
    this.memories.set(id, record);
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
      id: `chunk_${m.id}` as any,
      text: m.content,
      score: 0.8,
      source: String(m.type),
    }));
  }
}
