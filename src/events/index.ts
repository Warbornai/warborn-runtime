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

export class EventRuntime {
  public readonly eventStore = new EventStore();
  public readonly inMemoryBroker = new InMemoryBroker();
  public readonly redisBroker = new RedisBroker();
  public readonly bus = new DistributedEventBus(this.inMemoryBroker, this.eventStore);
  public readonly queues = new DistributedQueueSystem();
  public readonly workers = new WorkerRuntime();
  public readonly replay = new EventReplayEngine(this.eventStore);
  public readonly scheduler = new DistributedEventScheduler();
}

export type EventCallback<T = any> = (event: EventEnvelope<T>) => void | Promise<void>;

export class EventBus {
  private readonly distributedBus = new DistributedEventBus();

  public subscribe<T = any>(topic: EventTopic | string, callback: EventCallback<T>): () => void {
    return this.distributedBus.subscribe(topic as string, async (evt) => {
      const envelope: EventEnvelope<T> = {
        id: evt.eventId as any,
        topic: evt.eventType as any,
        source: evt.source,
        timestamp: evt.timestamp,
        payload: evt.payload as T,
        correlationId: evt.correlationId,
      };
      await callback(envelope);
    });
  }

  public async publish<T = any>(topic: EventTopic | string, payload: T, source = 'runtime'): Promise<EventEnvelope<T>> {
    const evt = await this.distributedBus.publish({
      eventType: topic as string,
      payload: payload as any,
      source,
    });

    return {
      id: evt.eventId as any,
      topic: topic as any,
      source: evt.source,
      timestamp: evt.timestamp,
      payload: evt.payload as T,
      correlationId: evt.correlationId,
    };
  }
}
