/**
 * Master Mission Runtime & Autonomous Workflow Engine Facade for Warborn OS.
 * Orchestrates long-running persistent missions, ExecutionPlan generation, DAG graph scheduling,
 * checkpointing, self-healing recovery, approval gates, artifact tracking, and telemetry.
 * @module @warborn/runtime/workflow
 */
import { Mission, MissionId, WorkflowStep } from '@warborn/types';
import { MissionStateStore } from './state';
import { MissionGraph } from './graph';
import { MissionScheduler } from './scheduler';
import { CheckpointManager } from './checkpoints';
import { RecoveryEngine } from './recovery';
import { ApprovalSystem } from './approvals';
import { ArtifactManager } from './artifacts';
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
export declare class MissionRuntime {
    private readonly toolRuntime?;
    readonly stateStore: MissionStateStore;
    readonly graph: MissionGraph;
    readonly scheduler: MissionScheduler;
    readonly checkpoints: CheckpointManager;
    readonly recovery: RecoveryEngine;
    readonly approvals: ApprovalSystem;
    readonly artifacts: ArtifactManager;
    private readonly planner;
    constructor(toolRuntime?: ToolRuntime | undefined);
    createMission(params: {
        title: string;
        description: string;
        goal: string;
        priority?: number;
        owner?: string;
        organization?: string;
        workspace?: string;
    }): Promise<Mission>;
    scheduleMission(missionId: MissionId): void;
    executeMission(missionId: MissionId): Promise<Mission>;
    pauseMission(missionId: MissionId): void;
    resumeMission(missionId: MissionId): void;
    getMission(missionId: MissionId): Mission | undefined;
}
export declare class WorkflowEngine {
    private readonly runtime;
    createMission(title: string, steps: readonly WorkflowStep[]): Mission;
    getMission(missionId: MissionId): Mission | undefined;
}
//# sourceMappingURL=index.d.ts.map