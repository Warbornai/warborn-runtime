/**
 * Long-Term Memory Subsystem.
 * Persists project, organization, repository, and preference settings with retention policies.
 * @module @warborn/runtime/memory/longterm
 */

import { MemoryRecord, MemoryType, MemoryId, ISO8601Timestamp } from '@warborn/types';

export class LongTermMemoryStore {
  private readonly store = new Map<MemoryId, MemoryRecord>();

  public persist(key: string, value: string, metadata: Record<string, unknown> = {}): MemoryRecord {
    const id = `mem_lt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as MemoryId;
    const record: MemoryRecord = {
      id,
      type: MemoryType.LONG_TERM,
      content: `[${key}]: ${value}`,
      importanceScore: 0.95,
      confidenceScore: 0.99,
      metadata: { key, ...metadata },
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };

    this.store.set(id, record);
    return record;
  }

  public get(key: string): MemoryRecord | undefined {
    return Array.from(this.store.values()).find(
      r => String(r.metadata.key || '').toLowerCase() === key.toLowerCase()
    );
  }
}
