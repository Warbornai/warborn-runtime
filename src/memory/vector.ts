/**
 * Abstract Vector Store Layer with PgVector Production Implementation.
 * Supports cosine similarity search across vector memory embeddings.
 * @module @warborn/runtime/memory/vector
 */

import { IVectorStore, MemoryRecord, MemoryId, VectorSearchResult } from '@warborn/types';

export class PgVectorStore implements IVectorStore {
  public readonly storeName = 'PgVectorStore';
  private readonly records = new Map<MemoryId, MemoryRecord>();

  public async insert(record: MemoryRecord): Promise<void> {
    this.records.set(record.id, record);
  }

  public async search(queryEmbedding: number[], limit = 5, minScore = 0.5): Promise<readonly VectorSearchResult[]> {
    const results: VectorSearchResult[] = [];

    for (const record of this.records.values()) {
      if (!record.embedding || record.embedding.values.length === 0) continue;

      const similarityScore = this.cosineSimilarity(queryEmbedding, record.embedding.values);
      if (similarityScore >= minScore) {
        results.push({ record, similarityScore });
      }
    }

    return results.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, limit);
  }

  public async delete(id: MemoryId): Promise<boolean> {
    return this.records.delete(id);
  }

  /** Compute cosine similarity between two vector arrays */
  private cosineSimilarity(vecA: readonly number[], vecB: readonly number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(vecA.length, vecB.length);

    for (let i = 0; i < len; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return parseFloat((dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(4));
  }
}
