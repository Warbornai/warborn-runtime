/**
 * Decoupled In-Memory Event Bus & PubSub Adapter Engine.
 * @module @warborn/runtime/events
 */
import { EventEnvelope, EventTopic } from '@warborn/types/events';
export type EventCallback<T = any> = (event: EventEnvelope<T>) => void | Promise<void>;
export declare class EventBus {
    private readonly listeners;
    subscribe<T = any>(topic: EventTopic, callback: EventCallback<T>): () => void;
    publish<T = any>(topic: EventTopic, payload: T, source?: string): Promise<EventEnvelope<T>>;
}
//# sourceMappingURL=index.d.ts.map