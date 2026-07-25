/**
 * Master Event Bus & Distributed Runtime Facade for Warborn OS.
 * Serves as the asynchronous communication backbone connecting Mission Runtime, Tool Runtime, Memory Engine, Context Engine, and Agents.
 * @module @warborn/runtime/events
 */
import { EventTopic, EventEnvelope } from '@warborn/types';
import { DistributedEventBus } from './bus';
import { InMemoryBroker, RedisBroker } from './broker';
import { DistributedQueueSystem } from './queues';
import { WorkerRuntime } from './workers';
import { EventStore } from './store';
import { EventReplayEngine } from './replay';
import { DistributedEventScheduler } from './scheduler';
export * from './broker';
export * from './queues';
export * from './workers';
export * from './store';
export * from './replay';
export * from './scheduler';
export * from './telemetry';
export * from './bus';
export declare class EventRuntime {
    readonly eventStore: EventStore;
    readonly inMemoryBroker: InMemoryBroker;
    readonly redisBroker: RedisBroker;
    readonly bus: DistributedEventBus;
    readonly queues: DistributedQueueSystem;
    readonly workers: WorkerRuntime;
    readonly replay: EventReplayEngine;
    readonly scheduler: DistributedEventScheduler;
}
export type EventCallback<T = any> = (event: EventEnvelope<T>) => void | Promise<void>;
export declare class EventBus {
    private readonly distributedBus;
    subscribe<T = any>(topic: EventTopic | string, callback: EventCallback<T>): () => void;
    publish<T = any>(topic: EventTopic | string, payload: T, source?: string): Promise<EventEnvelope<T>>;
}
//# sourceMappingURL=index.d.ts.map