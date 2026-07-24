/**
 * Master Mission Runtime & Autonomous Workflow Engine Facade for Warborn OS.
 * Orchestrates long-running persistent missions, ExecutionPlan generation, DAG graph scheduling,
 * checkpointing, self-healing recovery, approval gates, artifact tracking, and telemetry.
 * @module @warborn/runtime/workflow
 */

import {
  Mission,
  MissionId,
  MissionStatus,
  WorkflowStep,
  ISO8601Timestamp,
  MissionArtifactType,
} from '@warborn/types';
import { MissionStateStore } from './state';
import { MissionGraph } from './graph';
import { MissionScheduler } from './scheduler';
import { CheckpointManager } from './checkpoints';
import { RecoveryEngine } from './recovery';
import { ApprovalSystem } from './approvals';
import { ArtifactManager } from './artifacts';
import { MissionEventBus } from './events';
import { MissionTelemetryRecorder } from './telemetry';
import { PlannerEngine } from '../reasoning';
import { ToolRuntime } from '../tools';

export * from './state';
export * from './graph';
export * from './scheduler';
export * from './checkpoints';
export * from './recovery';
export * from './approvals';
export * from './artifacts';
export * from './events';
export * from './telemetry';

export class MissionRuntime {
  public readonly stateStore = new MissionStateStore();
  public readonly graph = new MissionGraph();
  public readonly scheduler: MissionScheduler;
  public readonly checkpoints = new CheckpointManager();
  public readonly recovery: RecoveryEngine;
  public readonly approvals = new ApprovalSystem();
  public readonly artifacts = new ArtifactManager();
  private readonly planner = new PlannerEngine();

  constructor(private readonly toolRuntime?: ToolRuntime) {
    this.scheduler = new MissionScheduler(this.stateStore);
    this.recovery = new RecoveryEngine(this.stateStore);
  }

  public async createMission(params: {
    title: string;
    description: string;
    goal: string;
    priority?: number;
    owner?: string;
    organization?: string;
    workspace?: string;
  }): Promise<Mission> {
    const missionId = `mission_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as MissionId;

    // 1. Generate ExecutionPlan via PlannerEngine
    const executionPlan = await this.planner.createExecutionPlan(params.goal);

    // 2. Build initial steps from plan
    const steps: WorkflowStep[] = executionPlan.stages.flatMap(stg =>
      stg.steps.map(s => ({
        id: `step_${s.stepId}` as any,
        name: s.description,
        agentId: s.assignedAgentRole,
        inputPayload: { goal: s.description },
        status: MissionStatus.CREATED,
      }))
    );

    const mission: Mission = {
      id: missionId,
      title: params.title,
      description: params.description,
      goal: params.goal,
      priority: params.priority || 5,
      owner: params.owner || 'user_owner',
      organization: params.organization || 'warborn-tech',
      workspace: params.workspace || 'main',
      status: MissionStatus.CREATED,
      executionPlan,
      steps,
      artifacts: [],
      checkpoints: [],
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };

    // 3. Save State & Emit Event
    this.stateStore.saveMission(mission);
    MissionEventBus.emit('MissionCreated', missionId, { title: params.title, planId: executionPlan.planId });

    return mission;
  }

  public scheduleMission(missionId: MissionId): void {
    const mission = this.stateStore.getMission(missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found.`);

    this.scheduler.scheduleMission(mission);
    MissionEventBus.emit('MissionStarted', missionId);
  }

  public async executeMission(missionId: MissionId): Promise<Mission> {
    const mission = this.stateStore.getMission(missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found.`);

    const startTime = Date.now();
    this.stateStore.updateStatus(missionId, MissionStatus.RUNNING);

    try {
      if (mission.executionPlan && this.toolRuntime) {
        // Execute tool runtime scheduler
        await this.toolRuntime.executePlan(mission.executionPlan);
      }

      // Checkpoint progress
      const checkpoint = this.checkpoints.createCheckpoint(missionId, 1, { status: 'completed' });
      MissionEventBus.emit('MissionCheckpointed', missionId, { checkpointId: checkpoint.id });

      // Generate Report Artifact
      const artifact = this.artifacts.createArtifact({
        missionId,
        name: `Mission Report - ${mission.title}`,
        type: MissionArtifactType.REPORT,
        uri: `artifacts/missions/${missionId}/report.md`,
        metadata: { goal: mission.goal },
      });
      MissionEventBus.emit('ArtifactCreated', missionId, { artifactId: artifact.id, name: artifact.name });

      // Complete Mission
      this.stateStore.updateStatus(missionId, MissionStatus.COMPLETED);
      MissionEventBus.emit('MissionCompleted', missionId, { durationMs: Date.now() - startTime });

      const finalMission = this.stateStore.getMission(missionId)!;
      MissionTelemetryRecorder.record({
        missionId,
        durationMs: Date.now() - startTime,
        status: MissionStatus.COMPLETED,
        artifactCount: finalMission.artifacts.length + 1,
        recoveryCount: 0,
        timestamp: new Date().toISOString(),
      });

      return finalMission;
    } catch (err: any) {
      const recovered = await this.recovery.handleFailure(mission, err.message);
      if (!recovered) {
        this.stateStore.updateStatus(missionId, MissionStatus.FAILED);
        MissionEventBus.emit('MissionFailed', missionId, { error: err.message });
      }
      return this.stateStore.getMission(missionId)!;
    }
  }

  public pauseMission(missionId: MissionId): void {
    this.checkpoints.createCheckpoint(missionId, 0, { state: 'paused' });
    this.stateStore.updateStatus(missionId, MissionStatus.PAUSED);
    MissionEventBus.emit('MissionPaused', missionId);
  }

  public resumeMission(missionId: MissionId): void {
    this.stateStore.updateStatus(missionId, MissionStatus.RUNNING);
    MissionEventBus.emit('MissionResumed', missionId);
  }

  public getMission(missionId: MissionId): Mission | undefined {
    return this.stateStore.getMission(missionId);
  }
}

export class WorkflowEngine {
  private readonly runtime = new MissionRuntime();

  public createMission(title: string, steps: readonly WorkflowStep[]): Mission {
    const missionId = `mission_${Date.now()}` as MissionId;
    const mission: Mission = {
      id: missionId,
      title,
      description: `Workflow mission for ${title}`,
      goal: title,
      priority: 5,
      owner: 'user',
      organization: 'warborn-tech',
      workspace: 'main',
      status: MissionStatus.CREATED,
      steps,
      artifacts: [],
      checkpoints: [],
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };
    this.runtime.stateStore.saveMission(mission);
    return mission;
  }

  public getMission(missionId: MissionId): Mission | undefined {
    return this.runtime.getMission(missionId);
  }
}
