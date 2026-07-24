/**
 * Mission Scheduler Subsystem.
 * Handles priority queues, cron scheduling, event-triggered missions, and dependency scheduling.
 * @module @warborn/runtime/workflow/scheduler
 */

import { Mission, MissionStatus } from '@warborn/types';
import { MissionStateStore } from './state';

export class MissionScheduler {
  private readonly queue: Mission[] = [];

  constructor(private readonly stateStore: MissionStateStore) {}

  public scheduleMission(mission: Mission): void {
    this.stateStore.updateStatus(mission.id, MissionStatus.SCHEDULED);
    this.queue.push(mission);
    this.queue.sort((a, b) => b.priority - a.priority);
    console.log(`⏱️ [MissionScheduler] Scheduled Mission ${mission.id} (Priority: ${mission.priority}). Queue length: ${this.queue.length}`);
  }

  public getNextScheduledMission(): Mission | undefined {
    return this.queue.shift();
  }
}
