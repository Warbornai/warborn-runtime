/**
 * Mission Lifecycle Event Bus.
 * Emits structured lifecycle events (MissionCreated, MissionStarted, MissionCompleted, ArtifactCreated, etc.).
 * @module @warborn/runtime/workflow/events
 */

export type MissionEventType =
  | 'MissionCreated'
  | 'MissionStarted'
  | 'MissionPaused'
  | 'MissionResumed'
  | 'MissionCheckpointed'
  | 'MissionFailed'
  | 'MissionRecovered'
  | 'MissionCompleted'
  | 'ArtifactCreated'
  | 'ApprovalRequested';

export interface MissionEventPayload {
  readonly eventType: MissionEventType;
  readonly missionId: string;
  readonly payload: Record<string, unknown>;
  readonly timestamp: string;
}

export class MissionEventBus {
  private static readonly history: MissionEventPayload[] = [];

  public static emit(eventType: MissionEventType, missionId: string, payload: Record<string, unknown> = {}): void {
    const event: MissionEventPayload = {
      eventType,
      missionId,
      payload,
      timestamp: new Date().toISOString(),
    };
    this.history.push(event);
    console.log(`📢 [MissionEventBus] Event: ${eventType} | Mission: ${missionId}`);
  }

  public static getHistory(): readonly MissionEventPayload[] {
    return this.history;
  }
}
