/**
 * Cortex Context Intelligence Engine - Master Assembly Facade.
 * @module @warborn/runtime/context
 */

import {
  ContextBundle,
  ContextId,
  ContextProviderResult,
  IContextProvider,
  ISO8601Timestamp,
  MemoryId,
  MemoryRecord,
  MemoryType,
} from '@warborn/types';
import {
  ConversationProvider,
  WorkingMemoryProvider,
  MissionProvider,
  WorkspaceProvider,
  KnowledgeProvider,
  ToolProvider,
  ProjectProvider,
  FileProvider,
} from './providers';
import { ContextRanker } from './ranker';
import { TokenBudgetManager } from './budget';
import { PromptBuilder } from './prompt';
import { ContextCache } from './cache';
import { PromptSanitizerMiddleware } from '../providers/middleware';

export * from './providers';
export * from './ranker';
export * from './budget';
export * from './prompt';
export * from './cache';

export class MemoryManager {
  private readonly memories = new Map<MemoryId, MemoryRecord>();

  public storeMemory(content: string, type: MemoryType): MemoryRecord {
    const id = `mem_${Date.now()}` as MemoryId;
    const record: MemoryRecord = {
      id,
      type,
      content,
      metadata: {},
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };
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
  private readonly providers: IContextProvider[] = [];
  private readonly cache = new ContextCache();
  private readonly budgetManager = new TokenBudgetManager();

  constructor(public readonly memoryManager?: MemoryManager) {
    // Register default context providers
    this.registerProvider(new ConversationProvider());
    this.registerProvider(new WorkingMemoryProvider());
    this.registerProvider(new MissionProvider());
    this.registerProvider(new WorkspaceProvider());
    this.registerProvider(new KnowledgeProvider());
    this.registerProvider(new ToolProvider());
    this.registerProvider(new ProjectProvider());
    this.registerProvider(new FileProvider());
  }

  public registerProvider(provider: IContextProvider): void {
    this.providers.push(provider);
    console.log(`🧠 [ContextEngine] Registered Context Provider: ${provider.sourceName}`);
  }

  public async generateContextBundle(userQuery: string, options?: Record<string, unknown>): Promise<ContextBundle> {
    // 1. Check Cache
    const cached = this.cache.get(userQuery);
    if (cached) {
      console.log(`⚡ [ContextEngine] Cache Hit for query: "${userQuery}"`);
      return cached;
    }

    // 2. Parallel Context Retrieval with Error Isolation
    const retrievalStart = Date.now();
    const providerPromises = this.providers.map(p =>
      p.retrieveContext(userQuery, options).catch(err => {
        console.warn(`⚠️ [ContextEngine] Provider ${p.sourceName} failed: ${err.message}`);
        return null;
      })
    );

    const rawResults = (await Promise.all(providerPromises)).filter(
      (res): res is ContextProviderResult => res !== null
    );
    const retrievalMs = Date.now() - retrievalStart;

    // 3. Secret Sanitization & Redaction
    const sanitizedResults = rawResults.map(res => ({
      ...res,
      context: PromptSanitizerMiddleware.sanitizeText(res.context),
    }));

    // 4. Multi-Criteria Context Ranking
    const rankingStart = Date.now();
    const rankedItems = ContextRanker.rankContext(userQuery, sanitizedResults);
    const rankingMs = Date.now() - rankingStart;

    // 5. Token Budget Optimization & Compression
    const budgetOptimization = this.budgetManager.optimize(rankedItems);

    // 6. Structured Prompt Assembly
    const structuredPrompt = PromptBuilder.buildStructuredPrompt(
      userQuery,
      budgetOptimization.compressedText,
      budgetOptimization.items
    );

    const bundle: ContextBundle = {
      id: `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` as ContextId,
      query: userQuery,
      rankedItems: budgetOptimization.items,
      totalTokens: budgetOptimization.totalTokens,
      compressedContent: budgetOptimization.compressedText,
      prompt: structuredPrompt,
      createdAt: new Date().toISOString() as ISO8601Timestamp,
      metrics: {
        retrievalMs,
        rankingMs,
        compressionRatio: budgetOptimization.compressionRatio,
        totalTokens: budgetOptimization.totalTokens,
        cacheHit: false,
      },
    };

    // 7. Store in Cache
    this.cache.set(userQuery, bundle);

    console.log(
      `📊 [ContextEngine] Bundle Assembled | Retrieval: ${retrievalMs}ms | Ranking: ${rankingMs}ms | Tokens: ${bundle.totalTokens} | Compression: ${bundle.metrics.compressionRatio}x`
    );

    return bundle;
  }
}
