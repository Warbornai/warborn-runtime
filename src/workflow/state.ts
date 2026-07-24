/**
 * Mission State Store Subsystem.
 * Persists active mission objects, state snapshots, and step progress.
 * @module @warborn/runtime/workflow/state
 */

import { Mission, MissionId, MissionStatus, ISO8601Timestamp } from '@warborn/types';

export class MissionStateStore {
  private readonly store = new Map<MissionId, Mission>();

  public saveMission(mission: Mission): void {
    this.store.set(mission.id, {
      ...mission,
      updatedAt: new Date().toISOString() as ISO8601Timestamp,
    });
  }

  public getMission(id: MissionId): Mission | undefined {
    return this.store.get(id);
  }

  public updateStatus(id: MissionId, status: MissionStatus): void {
    const mission = this.store.get(id);
    if (mission) {
      this.saveMission({
        ...mission,
        status,
      });
      console.log(`📌 [MissionStateStore] Mission ${id} state updated to: ${status}`);
    }
  }

  public listMissions(status?: MissionStatus): readonly Mission[] {
    const all = Array.from(this.store.values());
    return status ? all.filter(m => m.status === status) : all;
  }
}
