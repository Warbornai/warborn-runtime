/**
 * Post-Execution Cognitive Reflection Engine.
 * Evaluates execution outcome, promotes useful memories, demotes stale memories, and generates summaries.
 * @module @warborn/runtime/memory/reflection
 */

import { MemoryRecord, ISO8601Timestamp } from '@warborn/types';

export class ReflectionEngine {
  public reflectOnExecution(records: readonly MemoryRecord[], outcome: 'success' | 'failure'): readonly MemoryRecord[] {
    console.log(`🤔 [ReflectionEngine] Reflecting on execution outcome (${outcome})...`);

    return records.map(record => {
      let importanceScore = record.importanceScore;
      let confidenceScore = record.confidenceScore;

      if (outcome === 'success') {
        importanceScore = Math.min(1.0, parseFloat((importanceScore + 0.05).toFixed(2)));
        confidenceScore = Math.min(1.0, parseFloat((confidenceScore + 0.02).toFixed(2)));
      } else {
        importanceScore = Math.max(0.1, parseFloat((importanceScore - 0.1).toFixed(2)));
      }

      return {
        ...record,
        importanceScore,
        confidenceScore,
        updatedAt: new Date().toISOString() as ISO8601Timestamp,
      };
    });
  }

  public generateSummary(records: readonly MemoryRecord[]): string {
    if (records.length === 0) return 'No cognitive memories recorded.';
    const summaries = records.map(r => `[${r.type}] ${r.content}`).join(' | ');
    return `Cognitive Summary (${records.length} items): ${summaries}`;
  }
}
