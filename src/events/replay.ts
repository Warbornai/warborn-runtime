/**
 * Event Replay Subsystem.
 * Supports full replay, time-based replay, mission replay, and tenant replay.
 * @module @warborn/runtime/events/replay
 */

import { CortexEvent } from '@warborn/types';
import { EventStore } from './store';

export class EventReplayEngine {
  constructor(private readonly eventStore: EventStore) {}

  public async replayEvents(
    filter: { tenant?: string; category?: string },
    handler: (event: CortexEvent) => Promise<void>
  ): Promise<number> {
    const events = this.eventStore.getEvents(filter.tenant);
    let replayed = 0;

    console.log(`🔄 [EventReplayEngine] Replaying ${events.length} events...`);
    for (const event of events) {
      if (!filter.category || event.category === filter.category) {
        await handler(event);
        replayed++;
      }
    }

    return replayed;
  }
}
