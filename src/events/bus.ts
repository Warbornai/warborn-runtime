/**
 * Decoupled Distributed Event Bus Subsystem.
 * Supports publish, subscribe, request-reply, streaming, wildcards, and priority delivery.
 * @module @warborn/runtime/events/bus
 */

import { CortexEvent, EventCategory, EventId, EventPriority, ISO8601Timestamp } from '@warborn/types';
import { IMessageBroker } from '@warborn/types';
import { InMemoryBroker } from './broker';
import { EventStore } from './store';
import { EventTelemetryRecorder } from './telemetry';

export class DistributedEventBus {
  constructor(
    private readonly broker: IMessageBroker = new InMemoryBroker(),
    private readonly eventStore: EventStore = new EventStore()
  ) {}

  public async publish<T = Record<string, unknown>>(params: {
    eventType: string;
    category?: EventCategory;
    payload: T;
    source?: string;
    tenant?: string;
    workspace?: string;
    priority?: EventPriority;
    correlationId?: string;
  }): Promise<CortexEvent<T>> {
    const event: CortexEvent<T> = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as EventId,
      eventType: params.eventType,
      category: params.category || EventCategory.SYSTEM,
      version: '1.0.0',
      source: params.source || 'runtime.kernel',
      tenant: params.tenant || 'default_tenant',
      workspace: params.workspace || 'main',
      correlationId: params.correlationId,
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      priority: params.priority || EventPriority.NORMAL,
      payload: params.payload,
      metadata: {},
    };

    // 1. Append to EventStore
    this.eventStore.append(event as any);

    // 2. Publish via Broker
    await this.broker.publish(params.eventType, event as any);

    // 3. Record Telemetry
    EventTelemetryRecorder.recordPublish();

    return event;
  }

  public subscribe<T = Record<string, unknown>>(
    topic: string,
    handler: (event: CortexEvent<T>) => Promise<void>
  ): () => void {
    return this.broker.subscribe(topic, handler);
  }

  public async request<TReq = Record<string, unknown>, TRes = Record<string, unknown>>(
    topic: string,
    payload: TReq
  ): Promise<TRes> {
    const correlationId = `req_${Date.now()}`;
    return new Promise(async resolve => {
      const unsub = this.subscribe(`${topic}.reply.${correlationId}`, async (evt: any) => {
        unsub();
        resolve(evt.payload as TRes);
      });

      await this.publish({
        eventType: topic,
        payload: payload as any,
        correlationId,
      });
    });
  }
}
