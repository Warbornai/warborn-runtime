/**
 * Mission Telemetry & Observability Tracker.
 * @module @warborn/runtime/workflow/telemetry
 */

export interface MissionTelemetryPayload {
  readonly missionId: string;
  readonly durationMs: number;
  readonly status: string;
  readonly artifactCount: number;
  readonly recoveryCount: number;
  readonly timestamp: string;
}

export class MissionTelemetryRecorder {
  private static readonly history: MissionTelemetryPayload[] = [];

  public static record(payload: MissionTelemetryPayload): void {
    this.history.push(payload);
    console.log(`📊 [Mission Telemetry] Mission: ${payload.missionId} | Status: ${payload.status} | Duration: ${payload.durationMs}ms | Artifacts: ${payload.artifactCount}`);
  }
}
