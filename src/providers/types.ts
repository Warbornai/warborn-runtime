/**
 * Provider Types, Contracts, and Error Classes.
 * @module @warborn/runtime/providers/types
 */

import {
  ProviderType,
  ProviderHealth,
  ProviderTelemetryPayload,
  ChatOptions,
  EmbeddingOptions,
  IProvider,
} from '@warborn/types';

export {
  ProviderType,
  ProviderHealth,
  ProviderTelemetryPayload,
  ChatOptions,
  EmbeddingOptions,
  IProvider,
};

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly providerId: string,
    public readonly errorCode: string,
    public readonly isRetryable: boolean = false,
    public readonly originalError?: unknown
  ) {
    super(`[${providerId}:${errorCode}] ${message}`);
    this.name = 'ProviderError';
  }
}

export class BedrockAuthenticationError extends ProviderError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'AMAZON_BEDROCK', 'ERR_BEDROCK_AUTH_FAILED', false, originalError);
    this.name = 'BedrockAuthenticationError';
  }
}

export class BedrockThrottlingError extends ProviderError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'AMAZON_BEDROCK', 'ERR_BEDROCK_THROTTLED', true, originalError);
    this.name = 'BedrockThrottlingError';
  }
}

export class BedrockTimeoutError extends ProviderError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'AMAZON_BEDROCK', 'ERR_BEDROCK_TIMEOUT', true, originalError);
    this.name = 'BedrockTimeoutError';
  }
}
