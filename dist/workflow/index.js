"use strict";
/**
 * Master Mission Runtime & Autonomous Workflow Engine Facade for Warborn OS.
 * Orchestrates long-running persistent missions, ExecutionPlan generation, DAG graph scheduling,
 * checkpointing, self-healing recovery, approval gates, artifact tracking, and telemetry.
 * @module @warborn/runtime/workflow
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEngine = exports.MissionRuntime = void 0;
const types_1 = require("@warborn/types");
const state_1 = require("./state");
const graph_1 = require("./graph");
const scheduler_1 = require("./scheduler");
const checkpoints_1 = require("./checkpoints");
const recovery_1 = require("./recovery");
const approvals_1 = require("./approvals");
const artifacts_1 = require("./artifacts");
const events_1 = require("./events");
const telemetry_1 = require("./telemetry");
const reasoning_1 = require("../reasoning");
__exportStar(require("./state"), exports);
__exportStar(require("./graph"), exports);
__exportStar(require("./scheduler"), exports);
__exportStar(require("./checkpoints"), exports);
__exportStar(require("./recovery"), exports);
__exportStar(require("./approvals"), exports);
__exportStar(require("./artifacts"), exports);
__exportStar(require("./events"), exports);
__exportStar(require("./telemetry"), exports);
class MissionRuntime {
    toolRuntime;
    stateStore = new state_1.MissionStateStore();
    graph = new graph_1.MissionGraph();
    scheduler;
    checkpoints = new checkpoints_1.CheckpointManager();
    recovery;
    approvals = new approvals_1.ApprovalSystem();
    artifacts = new artifacts_1.ArtifactManager();
    planner = new reasoning_1.PlannerEngine();
    constructor(toolRuntime) {
        this.toolRuntime = toolRuntime;
        this.scheduler = new scheduler_1.MissionScheduler(this.stateStore);
        this.recovery = new recovery_1.RecoveryEngine(this.stateStore);
    }
    async createMission(params) {
        const missionId = `mission_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        // 1. Generate ExecutionPlan via PlannerEngine
        const executionPlan = await this.planner.createExecutionPlan(params.goal);
        // 2. Build initial steps from plan
        const steps = executionPlan.stages.flatMap(stg => stg.steps.map(s => ({
            id: `step_${s.stepId}`,
            name: s.description,
            agentId: s.assignedAgentRole,
            inputPayload: { goal: s.description },
            status: types_1.MissionStatus.CREATED,
        })));
        const mission = {
            id: missionId,
            title: params.title,
            description: params.description,
            goal: params.goal,
            priority: params.priority || 5,
            owner: params.owner || 'user_owner',
            organization: params.organization || 'warborn-tech',
            workspace: params.workspace || 'main',
            status: types_1.MissionStatus.CREATED,
            executionPlan,
            steps,
            artifacts: [],
            checkpoints: [],
            createdAt: new Date().toISOString(),
        };
        // 3. Save State & Emit Event
        this.stateStore.saveMission(mission);
        events_1.MissionEventBus.emit('MissionCreated', missionId, { title: params.title, planId: executionPlan.planId });
        return mission;
    }
    scheduleMission(missionId) {
        const mission = this.stateStore.getMission(missionId);
        if (!mission)
            throw new Error(`Mission ${missionId} not found.`);
        this.scheduler.scheduleMission(mission);
        events_1.MissionEventBus.emit('MissionStarted', missionId);
    }
    async executeMission(missionId) {
        const mission = this.stateStore.getMission(missionId);
        if (!mission)
            throw new Error(`Mission ${missionId} not found.`);
        const startTime = Date.now();
        this.stateStore.updateStatus(missionId, types_1.MissionStatus.RUNNING);
        try {
            if (mission.executionPlan && this.toolRuntime) {
                // Execute tool runtime scheduler
                await this.toolRuntime.executePlan(mission.executionPlan);
            }
            // Checkpoint progress
            const checkpoint = this.checkpoints.createCheckpoint(missionId, 1, { status: 'completed' });
            events_1.MissionEventBus.emit('MissionCheckpointed', missionId, { checkpointId: checkpoint.id });
            // Generate Report Artifact
            const artifact = this.artifacts.createArtifact({
                missionId,
                name: `Mission Report - ${mission.title}`,
                type: types_1.MissionArtifactType.REPORT,
                uri: `artifacts/missions/${missionId}/report.md`,
                metadata: { goal: mission.goal },
            });
            events_1.MissionEventBus.emit('ArtifactCreated', missionId, { artifactId: artifact.id, name: artifact.name });
            // Complete Mission
            this.stateStore.updateStatus(missionId, types_1.MissionStatus.COMPLETED);
            events_1.MissionEventBus.emit('MissionCompleted', missionId, { durationMs: Date.now() - startTime });
            const finalMission = this.stateStore.getMission(missionId);
            telemetry_1.MissionTelemetryRecorder.record({
                missionId,
                durationMs: Date.now() - startTime,
                status: types_1.MissionStatus.COMPLETED,
                artifactCount: finalMission.artifacts.length + 1,
                recoveryCount: 0,
                timestamp: new Date().toISOString(),
            });
            return finalMission;
        }
        catch (err) {
            const recovered = await this.recovery.handleFailure(mission, err.message);
            if (!recovered) {
                this.stateStore.updateStatus(missionId, types_1.MissionStatus.FAILED);
                events_1.MissionEventBus.emit('MissionFailed', missionId, { error: err.message });
            }
            return this.stateStore.getMission(missionId);
        }
    }
    pauseMission(missionId) {
        this.checkpoints.createCheckpoint(missionId, 0, { state: 'paused' });
        this.stateStore.updateStatus(missionId, types_1.MissionStatus.PAUSED);
        events_1.MissionEventBus.emit('MissionPaused', missionId);
    }
    resumeMission(missionId) {
        this.stateStore.updateStatus(missionId, types_1.MissionStatus.RUNNING);
        events_1.MissionEventBus.emit('MissionResumed', missionId);
    }
    getMission(missionId) {
        return this.stateStore.getMission(missionId);
    }
}
exports.MissionRuntime = MissionRuntime;
class WorkflowEngine {
    runtime = new MissionRuntime();
    createMission(title, steps) {
        const missionId = `mission_${Date.now()}`;
        const mission = {
            id: missionId,
            title,
            description: `Workflow mission for ${title}`,
            goal: title,
            priority: 5,
            owner: 'user',
            organization: 'warborn-tech',
            workspace: 'main',
            status: types_1.MissionStatus.CREATED,
            steps,
            artifacts: [],
            checkpoints: [],
            createdAt: new Date().toISOString(),
        };
        this.runtime.stateStore.saveMission(mission);
        return mission;
    }
    getMission(missionId) {
        return this.runtime.getMission(missionId);
    }
}
exports.WorkflowEngine = WorkflowEngine;
//# sourceMappingURL=index.js.map