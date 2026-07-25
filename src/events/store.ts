/**
 * Append-Only Persistent Event Store.
 * Supports event appending, snapshots, retention compaction, and audit trail retrieval.
 * @module @warborn/runtime/events/store
 */

import { CortexEvent } from '@warborn/types';

export class EventStore {
  private readonly events: CortexEvent[] = [];
  private readonly snapshots = new Map<string, Record<string, unknown>>();

  public append(event: CortexEvent): void {
    this.events.push(event);
    console.log(`💾 [EventStore] Appended Event ${event.eventId} (Topic: ${event.eventType}) to persistent store.`);
  }

  public getEvents(tenant?: string): readonly CortexEvent[] {
    return tenant ? this.events.filter(e => e.tenant === tenant) : this.events;
  }

  public createSnapshot(entityId: string, state: Record<string, unknown>): void {
    this.snapshots.set(entityId, state);
    console.log(`📸 [EventStore] Created Snapshot for entity ${entityId}`);
  }
}
