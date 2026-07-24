/**
 * Semantic Memory Subsystem.
 * Stores facts, concepts, entities, and project knowledge with confidence ratings & deduplication.
 * @module @warborn/runtime/memory/semantic
 */

import { MemoryRecord, MemoryType, MemoryId, ISO8601Timestamp } from '@warborn/types';

export class SemanticMemoryStore {
  private readonly store = new Map<MemoryId, MemoryRecord>();

  public storeFact(concept: string, factContent: string, confidenceScore = 0.9): MemoryRecord {
    // Deduplication check
    for (const existing of this.store.values()) {
      if (existing.content.toLowerCase() === factContent.toLowerCase()) {
        return existing;
      }
    }

    const id = `mem_sem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as MemoryId;
    const record: MemoryRecord = {
      id,
      type: MemoryType.SEMANTIC,
      content: factContent,
      importanceScore: 0.88,
      confidenceScore,
      metadata: { concept },
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };

    this.store.set(id, record);
    return record;
  }

  public lookupConcept(concept: string): readonly MemoryRecord[] {
    const cLower = concept.toLowerCase();
    return Array.from(this.store.values()).filter(
      r => String(r.metadata.concept || '').toLowerCase().includes(cLower) || r.content.toLowerCase().includes(cLower)
    );
  }
}
