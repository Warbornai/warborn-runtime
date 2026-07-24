"use strict";
/**
 * Cortex Context Intelligence Engine - Master Assembly Facade.
 * @module @warborn/runtime/context
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextEngine = void 0;
const providers_1 = require("./providers");
const ranker_1 = require("./ranker");
const budget_1 = require("./budget");
const prompt_1 = require("./prompt");
const cache_1 = require("./cache");
const middleware_1 = require("../providers/middleware");
__exportStar(require("./providers"), exports);
__exportStar(require("./ranker"), exports);
__exportStar(require("./budget"), exports);
__exportStar(require("./prompt"), exports);
__exportStar(require("./cache"), exports);
class ContextEngine {
    memoryManager;
    providers = [];
    cache = new cache_1.ContextCache();
    budgetManager = new budget_1.TokenBudgetManager();
    constructor(memoryManager) {
        this.memoryManager = memoryManager;
        // Register default context providers
        this.registerProvider(new providers_1.ConversationProvider());
        this.registerProvider(new providers_1.WorkingMemoryProvider());
        this.registerProvider(new providers_1.MissionProvider());
        this.registerProvider(new providers_1.WorkspaceProvider());
        this.registerProvider(new providers_1.KnowledgeProvider());
        this.registerProvider(new providers_1.ToolProvider());
        this.registerProvider(new providers_1.ProjectProvider());
        this.registerProvider(new providers_1.FileProvider());
    }
    registerProvider(provider) {
        this.providers.push(provider);
        console.log(`🧠 [ContextEngine] Registered Context Provider: ${provider.sourceName}`);
    }
    async generateContextBundle(userQuery, options) {
        // 1. Check Cache
        const cached = this.cache.get(userQuery);
        if (cached) {
            console.log(`⚡ [ContextEngine] Cache Hit for query: "${userQuery}"`);
            return cached;
        }
        // 2. Parallel Context Retrieval with Error Isolation
        const retrievalStart = Date.now();
        const providerPromises = this.providers.map(p => p.retrieveContext(userQuery, options).catch(err => {
            console.warn(`⚠️ [ContextEngine] Provider ${p.sourceName} failed: ${err.message}`);
            return null;
        }));
        const rawResults = (await Promise.all(providerPromises)).filter((res) => res !== null);
        const retrievalMs = Date.now() - retrievalStart;
        // 3. Secret Sanitization & Redaction
        const sanitizedResults = rawResults.map(res => ({
            ...res,
            context: middleware_1.PromptSanitizerMiddleware.sanitizeText(res.context),
        }));
        // 4. Multi-Criteria Context Ranking
        const rankingStart = Date.now();
        const rankedItems = ranker_1.ContextRanker.rankContext(userQuery, sanitizedResults);
        const rankingMs = Date.now() - rankingStart;
        // 5. Token Budget Optimization & Compression
        const budgetOptimization = this.budgetManager.optimize(rankedItems);
        // 6. Structured Prompt Assembly
        const structuredPrompt = prompt_1.PromptBuilder.buildStructuredPrompt(userQuery, budgetOptimization.compressedText, budgetOptimization.items);
        const bundle = {
            id: `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            query: userQuery,
            rankedItems: budgetOptimization.items,
            totalTokens: budgetOptimization.totalTokens,
            compressedContent: budgetOptimization.compressedText,
            prompt: structuredPrompt,
            createdAt: new Date().toISOString(),
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
        console.log(`📊 [ContextEngine] Bundle Assembled | Retrieval: ${retrievalMs}ms | Ranking: ${rankingMs}ms | Tokens: ${bundle.totalTokens} | Compression: ${bundle.metrics.compressionRatio}x`);
        return bundle;
    }
}
exports.ContextEngine = ContextEngine;
//# sourceMappingURL=index.js.map