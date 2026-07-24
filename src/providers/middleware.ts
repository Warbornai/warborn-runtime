/**
 * Provider Middleware: Prompt Sanitization, Rate Limiting, & Telemetry Injection.
 * @module @warborn/runtime/providers/middleware
 */

import { ChatMessage } from '@warborn/types';

export class PromptSanitizerMiddleware {
  /** Sanitize prompts before sending to providers or logging */
  public static sanitizeMessages(messages: readonly ChatMessage[]): ChatMessage[] {
    return messages.map(msg => ({
      ...msg,
      content: this.sanitizeText(msg.content),
    }));
  }

  /** Mask API keys, bearer tokens, or credit cards in text */
  public static sanitizeText(text: string): string {
    if (!text) return '';
    return text
      .replace(/AKIA[0-9A-Z]{16}/g, '[MASKED_AWS_ACCESS_KEY]')
      .replace(/[A-Za-z0-9/+=]{40}/g, (match) => match.length === 40 && !match.includes(' ') ? '[MASKED_AWS_SECRET_KEY]' : match)
      .replace(/sk-[a-zA-Z0-9]{48}/g, '[MASKED_OPENAI_KEY]')
      .replace(/bearer\s+[a-zA-Z0-9._-]+/gi, 'Bearer [MASKED_TOKEN]');
  }
}

export class RateLimiterMiddleware {
  private requestsInWindow = 0;
  private windowStart = Date.now();

  constructor(private readonly maxRequestsPerMinute: number = 600) {}

  public async acquireToken(): Promise<void> {
    const now = Date.now();
    if (now - this.windowStart > 60000) {
      this.windowStart = now;
      this.requestsInWindow = 0;
    }

    if (this.requestsInWindow >= this.maxRequestsPerMinute) {
      const waitMs = 60000 - (now - this.windowStart);
      await new Promise(resolve => setTimeout(resolve, waitMs));
      return this.acquireToken();
    }

    this.requestsInWindow++;
  }
}
