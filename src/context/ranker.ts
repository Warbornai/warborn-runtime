/**
 * Weighted Multi-Criteria Context Ranker for Cortex Context Engine.
 * @module @warborn/runtime/context/ranker
 */

import { ContextProviderResult, ContextRankedItem } from '@warborn/types';

export class ContextRanker {
  /** Weighting coefficients summing to 1.0 */
  private static readonly WEIGHTS = {
    relevance: 0.35,
    recency: 0.20,
    importance: 0.15,
    mission: 0.15,
    workspace: 0.15,
  };

  public static rankContext(query: string, rawResults: readonly ContextProviderResult[]): readonly ContextRankedItem[] {
    const queryLower = query.toLowerCase();

    const ranked: ContextRankedItem[] = rawResults.map(item => {
      // 1. Relevance Score (Keyword matching & string density)
      const textLower = item.context.toLowerCase();
      const matchCount = (textLower.match(new RegExp(queryLower, 'g')) || []).length;
      const relevanceScore = Math.min(1.0, 0.5 + matchCount * 0.2);

      // 2. Recency Score (Derived from priority & provider type)
      const recencyScore = Math.min(1.0, item.priority / 10);

      // 3. Importance Score (Confidence rating from provider)
      const importanceScore = item.confidence;

      // 4. Mission Score (Higher weight for Mission & Task context)
      const missionScore = item.sourceName.includes('Mission') || item.sourceName.includes('Memory') ? 0.95 : 0.70;

      // 5. Workspace Score (Relevance to active file & project)
      const workspaceScore = item.sourceName.includes('Workspace') || item.sourceName.includes('File') ? 0.90 : 0.65;

      // Weighted Composite Calculation
      const finalScore = parseFloat(
        (
          relevanceScore * this.WEIGHTS.relevance +
          recencyScore * this.WEIGHTS.recency +
          importanceScore * this.WEIGHTS.importance +
          missionScore * this.WEIGHTS.mission +
          workspaceScore * this.WEIGHTS.workspace
        ).toFixed(4)
      );

      return {
        sourceName: item.sourceName,
        context: item.context,
        relevanceScore,
        recencyScore,
        importanceScore,
        missionScore,
        workspaceScore,
        finalScore,
        tokens: item.tokens,
      };
    });

    // Sort descending by finalScore
    return ranked.sort((a, b) => b.finalScore - a.finalScore);
  }
}
