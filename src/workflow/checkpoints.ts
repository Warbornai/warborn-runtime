/**
 * Checkpoint Manager Subsystem.
 * Automatically persists execution progress, state snapshots, tool results, and context references for pause/resume.
 * @module @warborn/runtime/workflow/checkpoints
 */

import { MissionCheckpoint, CheckpointId, MissionId, ISO8601Timestamp } from '@warborn/types';

export class CheckpointManager {
  private readonly checkpoints = new Map<CheckpointId, MissionCheckpoint>();

  public createCheckpoint(missionId: MissionId, stageIndex: number, snapshot: Record<string, unknown>): MissionCheckpoint {
    const id = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as CheckpointId;
    const checkpoint: MissionCheckpoint = {
      id,
      missionId,
      stageIndex,
      stateSnapshot: snapshot,
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };

    this.checkpoints.set(id, checkpoint);
    console.log(`💾 [CheckpointManager] Created Checkpoint ${id} for Mission ${missionId} at Stage ${stageIndex}`);
    return checkpoint;
  }

  public getLatestCheckpoint(missionId: MissionId): MissionCheckpoint | undefined {
    return Array.from(this.checkpoints.values())
      .filter(c => c.missionId === missionId)
      .pop();
  }
}
