/**
 * Procedural Memory Subsystem.
 * Stores execution patterns, workflows, best practices, and automation strategies to improve future runs.
 * @module @warborn/runtime/memory/procedural
 */

import { ProceduralMemoryRecord, MemoryType, MemoryId, ISO8601Timestamp } from '@warborn/types';

export class ProceduralMemoryStore {
  private readonly procedures = new Map<MemoryId, ProceduralMemoryRecord>();

  public storeProcedure(params: {
    workflowName: string;
    executionPattern: readonly string[];
    bestPractices: readonly string[];
    successRate?: number;
  }): ProceduralMemoryRecord {
    const id = `mem_proc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` as MemoryId;
    const record: ProceduralMemoryRecord = {
      id,
      type: MemoryType.PROCEDURAL,
      workflowName: params.workflowName,
      executionPattern: params.executionPattern,
      bestPractices: params.bestPractices,
      successRate: params.successRate || 1.0,
      content: `Workflow [${params.workflowName}]: Steps [${params.executionPattern.join(' -> ')}]`,
      importanceScore: 0.92,
      confidenceScore: 0.95,
      metadata: { workflow: params.workflowName },
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };

    this.procedures.set(id, record);
    return record;
  }

  public getProcedure(workflowName: string): ProceduralMemoryRecord | undefined {
    return Array.from(this.procedures.values()).find(
      p => p.workflowName.toLowerCase() === workflowName.toLowerCase()
    );
  }
}
