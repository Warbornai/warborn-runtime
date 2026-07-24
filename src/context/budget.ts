/**
 * Token Budget Manager & Context Compressor for Cortex Context Engine.
 * @module @warborn/runtime/context/budget
 */

import { ContextRankedItem } from '@warborn/types';

export interface BudgetConfig {
  readonly maxContextTokens: number;
  readonly reservedResponseTokens: number;
}

export class TokenBudgetManager {
  private readonly maxPromptTokens: number;

  constructor(config: BudgetConfig = { maxContextTokens: 8192, reservedResponseTokens: 1024 }) {
    this.maxPromptTokens = config.maxContextTokens - config.reservedResponseTokens;
  }

  public optimize(rankedItems: readonly ContextRankedItem[]): {
    readonly items: readonly ContextRankedItem[];
    readonly totalTokens: number;
    readonly compressedText: string;
    readonly compressionRatio: number;
  } {
    let accumulatedTokens = 0;
    const acceptedItems: ContextRankedItem[] = [];
    const textChunks: string[] = [];

    for (const item of rankedItems) {
      if (accumulatedTokens + item.tokens <= this.maxPromptTokens) {
        acceptedItems.push(item);
        accumulatedTokens += item.tokens;
        textChunks.push(item.context);
      } else {
        // Truncate/compress remaining chunk to fit remaining budget
        const remainingBudget = this.maxPromptTokens - accumulatedTokens;
        if (remainingBudget > 50) {
          const charLimit = remainingBudget * 4;
          const compressed = item.context.substring(0, charLimit) + '... [TRUNCATED FOR TOKEN BUDGET]';
          const compressedTokens = Math.ceil(compressed.length / 4);

          textChunks.push(compressed);
          accumulatedTokens += compressedTokens;
        }
        break; // Stop including lower-ranked items once budget is filled
      }
    }

    const uncompressedLength = rankedItems.reduce((acc, cur) => acc + cur.context.length, 0);
    const compressedText = textChunks.join('\n\n');
    const compressedLength = compressedText.length;

    const compressionRatio = uncompressedLength > 0 ? parseFloat((compressedLength / uncompressedLength).toFixed(2)) : 1.0;

    return {
      items: acceptedItems,
      totalTokens: accumulatedTokens,
      compressedText,
      compressionRatio,
    };
  }
}
