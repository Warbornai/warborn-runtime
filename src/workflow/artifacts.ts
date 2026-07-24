/**
 * Artifact Management Subsystem.
 * Tracks every code, document, image, report, dataset, or log generated during mission execution.
 * @module @warborn/runtime/workflow/artifacts
 */

import { MissionArtifact, MissionArtifactType, ArtifactId, MissionId, ISO8601Timestamp } from '@warborn/types';

export class ArtifactManager {
  private readonly artifacts = new Map<ArtifactId, MissionArtifact>();

  public createArtifact(params: {
    missionId: MissionId;
    name: string;
    type: MissionArtifactType;
    uri: string;
    metadata?: Record<string, unknown>;
  }): MissionArtifact {
    const id = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as ArtifactId;
    const artifact: MissionArtifact = {
      id,
      missionId: params.missionId,
      name: params.name,
      type: params.type,
      uri: params.uri,
      metadata: params.metadata || {},
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };

    this.artifacts.set(id, artifact);
    console.log(`📦 [ArtifactManager] Generated Artifact: ${params.name} (${params.type}) for Mission ${params.missionId}`);
    return artifact;
  }

  public getMissionArtifacts(missionId: MissionId): readonly MissionArtifact[] {
    return Array.from(this.artifacts.values()).filter(a => a.missionId === missionId);
  }
}
