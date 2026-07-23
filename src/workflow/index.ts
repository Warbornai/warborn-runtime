/**
 * Workflow Execution and Mission Engine.
 * @module @warborn/runtime/workflow
 */

import { Mission, MissionId, WorkflowStep, ISO8601Timestamp, ExecutionStatus } from '@warborn/types';

export class WorkflowEngine {
  private readonly missions = new Map<MissionId, Mission>();

  public createMission(title: string, steps: readonly WorkflowStep[]): Mission {
    const missionId = `mission_${Date.now()}` as MissionId;
    const mission: Mission = {
      id: missionId as any,
      missionId,
      title,
      description: `Mission for ${title}`,
      status: ExecutionStatus.PENDING,
      steps,
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    } as any;
    this.missions.set(missionId, mission);
    return mission;
  }

  public getMission(missionId: MissionId): Mission | undefined {
    return this.missions.get(missionId);
  }
}
