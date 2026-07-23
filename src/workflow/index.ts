/**
 * Workflow Execution and Mission Engine.
 * @module @warborn/runtime/workflow
 */

import { Mission, MissionId, WorkflowStep, ISO8601Timestamp } from '@warborn/types';

export class WorkflowEngine {
  private readonly missions = new Map<MissionId, Mission>();

  public createMission(title: string, steps: readonly WorkflowStep[]): Mission {
    const missionId = `mission_${Date.now()}` as MissionId;
    const mission: Mission = {
      missionId,
      title,
      description: `Mission for ${title}`,
      status: 'pending',
      steps,
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };
    this.missions.set(missionId, mission);
    return mission;
  }

  public getMission(missionId: MissionId): Mission | undefined {
    return this.missions.get(missionId);
  }
}
