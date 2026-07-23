/**
 * Workflow Execution and Mission Engine.
 * @module @warborn/runtime/workflow
 */
import { Mission, MissionId, WorkflowStep } from '@warborn/types/workflow';
export declare class WorkflowEngine {
    private readonly missions;
    createMission(title: string, steps: readonly WorkflowStep[]): Mission;
    getMission(missionId: MissionId): Mission | undefined;
}
//# sourceMappingURL=index.d.ts.map