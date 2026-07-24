/**
 * Episodic Memory Subsystem.
 * Stores user interactions, missions, important decisions, failures, and milestones.
 * @module @warborn/runtime/memory/episodic
 */

import { EpisodicMemoryRecord, MemoryType, MemoryId, ISO8601Timestamp } from '@warborn/types';

export class EpisodicMemoryStore {
  private readonly episodes = new Map<MemoryId, EpisodicMemoryRecord>();

  public recordEpisode(params: {
    summary: string;
    content: string;
    outcome: 'success' | 'failure' | 'in_progress';
    participants?: readonly string[];
    references?: readonly string[];
    importanceScore?: number;
  }): EpisodicMemoryRecord {
    const id = `mem_ep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as MemoryId;
    const record: EpisodicMemoryRecord = {
      id,
      type: MemoryType.EPISODIC,
      summary: params.summary,
      content: params.content,
      outcome: params.outcome,
      participants: params.participants || ['user', 'cortex'],
      references: params.references || [],
      importanceScore: params.importanceScore || 0.85,
      confidenceScore: 0.95,
      metadata: { recordedBy: 'EpisodicMemoryStore' },
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };

    this.episodes.set(id, record);
    return record;
  }

  public queryEpisodes(query: string, limit = 5): readonly EpisodicMemoryRecord[] {
    const qLower = query.toLowerCase();
    return Array.from(this.episodes.values())
      .filter(ep => ep.summary.toLowerCase().includes(qLower) || ep.content.toLowerCase().includes(qLower))
      .sort((a, b) => b.importanceScore - a.importanceScore)
      .slice(0, limit);
  }

  public getAll(): readonly EpisodicMemoryRecord[] {
    return Array.from(this.episodes.values());
  }
}
