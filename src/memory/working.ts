/**
 * Working Memory Subsystem.
 * Stores active goals, temporary reasoning, tool outputs, and execution state with auto-expiry.
 * @module @warborn/runtime/memory/working
 */

import { MemoryRecord, MemoryType, MemoryId, ISO8601Timestamp } from '@warborn/types';

export class WorkingMemoryStore {
  private readonly store = new Map<MemoryId, MemoryRecord>();

  public storeWorkingMemory(content: string, metadata: Record<string, unknown> = {}, ttlSeconds = 600): MemoryRecord {
    const id = `mem_work_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as MemoryId;
    const record: MemoryRecord = {
      id,
      type: MemoryType.WORKING,
      content,
      importanceScore: 0.9,
      confidenceScore: 0.95,
      metadata: { ...metadata, sessionState: 'active' },
      createdAt: new Date().toISOString() as ISO8601Timestamp,
      ttlSeconds,
    };

    this.store.set(id, record);

    // Auto-expire after TTL
    setTimeout(() => {
      this.store.delete(id);
    }, ttlSeconds * 1000);

    return record;
  }

  public getActiveMemories(): readonly MemoryRecord[] {
    return Array.from(this.store.values());
  }

  public clearSession(): void {
    this.store.clear();
  }
}
