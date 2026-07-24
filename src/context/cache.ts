/**
 * Context Cache Subsystem (TTL & LRU Eviction).
 * @module @warborn/runtime/context/cache
 */

import { ContextBundle } from '@warborn/types';

interface CacheEntry {
  readonly bundle: ContextBundle;
  readonly expiresAt: number;
}

export class ContextCache {
  private readonly cache = new Map<string, CacheEntry>();

  constructor(
    private readonly ttlMs: number = 300000, // 5 minutes
    private readonly maxEntries: number = 100
  ) {}

  public get(query: string): ContextBundle | null {
    const key = this.normalizeKey(query);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh LRU position
    this.cache.delete(key);
    this.cache.set(key, entry);

    return {
      ...entry.bundle,
      metrics: {
        ...entry.bundle.metrics,
        cacheHit: true,
      },
    };
  }

  public set(query: string, bundle: ContextBundle): void {
    const key = this.normalizeKey(query);

    // Evict LRU item if capacity reached
    if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      bundle,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  private normalizeKey(query: string): string {
    return query.trim().toLowerCase();
  }
}
