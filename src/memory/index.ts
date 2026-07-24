/**
 * Master Cognitive Memory Engine Facade.
 * Orchestrates 5 memory tiers (Working, Episodic, Semantic, Procedural, Long-Term),
 * PgVectorStore, KnowledgeGraphStore, ReflectionEngine, and Telemetry.
 * @module @warborn/runtime/memory
 */

import { MemoryRecord, MemoryType, MemoryId, ISO8601Timestamp } from '@warborn/types';
import { WorkingMemoryStore } from './working';
import { EpisodicMemoryStore } from './episodic';
import { SemanticMemoryStore } from './semantic';
import { ProceduralMemoryStore } from './procedural';
import { LongTermMemoryStore } from './longterm';
import { PgVectorStore } from './vector';
import { KnowledgeGraphStore } from './graph';
import { ReflectionEngine } from './reflection';
import { MemoryTelemetryRecorder } from './telemetry';

export * from './working';
export * from './episodic';
export * from './semantic';
export * from './procedural';
export * from './longterm';
export * from './vector';
export * from './graph';
export * from './reflection';
export * from './telemetry';

export class MemoryManager {
  public readonly working = new WorkingMemoryStore();
  public readonly episodic = new EpisodicMemoryStore();
  public readonly semantic = new SemanticMemoryStore();
  public readonly procedural = new ProceduralMemoryStore();
  public readonly longTerm = new LongTermMemoryStore();

  public readonly vectorStore = new PgVectorStore();
  public readonly knowledgeGraph = new KnowledgeGraphStore();
  public readonly reflectionEngine = new ReflectionEngine();

  public storeMemory(content: string, type: MemoryType): MemoryRecord {
    MemoryTelemetryRecorder.recordWrite();
    if (type === MemoryType.WORKING) {
      return this.working.storeWorkingMemory(content);
    }
    if (type === MemoryType.SEMANTIC) {
      return this.semantic.storeFact('general', content);
    }
    if (type === MemoryType.LONG_TERM) {
      return this.longTerm.persist('general', content);
    }

    const id = `mem_${Date.now()}` as MemoryId;
    const record: MemoryRecord = {
      id,
      type,
      content,
      importanceScore: 0.8,
      confidenceScore: 0.9,
      metadata: {},
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };
    return record;
  }

  public searchMemories(query: string, limit = 5): readonly MemoryRecord[] {
    MemoryTelemetryRecorder.recordRead();
    const results: MemoryRecord[] = [];

    // Search working memory
    const working = this.working.getActiveMemories().filter(m => m.content.toLowerCase().includes(query.toLowerCase()));
    results.push(...working);

    // Search semantic memory
    const semantic = this.semantic.lookupConcept(query);
    results.push(...semantic);

    // Search episodic memory
    const episodic = this.episodic.queryEpisodes(query, limit);
    results.push(...episodic);

    return results.slice(0, limit);
  }

  public reflectOnSession(outcome: 'success' | 'failure'): readonly MemoryRecord[] {
    const activeMemories = this.working.getActiveMemories();
    return this.reflectionEngine.reflectOnExecution(activeMemories, outcome);
  }

  public getMetrics() {
    const activeCount = this.working.getActiveMemories().length + this.episodic.getAll().length;
    return MemoryTelemetryRecorder.getMetrics(activeCount, 12);
  }
}

export class MemoryEngine extends MemoryManager {}
