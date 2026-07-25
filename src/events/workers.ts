/**
 * Worker Pool Runtime.
 * Manages local/remote worker nodes, horizontal scaling, heartbeat monitoring, and graceful shutdown.
 * @module @warborn/runtime/events/workers
 */

export interface WorkerNode {
  readonly workerId: string;
  readonly name: string;
  readonly capabilities: readonly string[];
  readonly status: 'active' | 'busy' | 'draining' | 'dead';
  readonly lastHeartbeat: string;
}

export class WorkerRuntime {
  private readonly workers = new Map<string, WorkerNode>();

  constructor() {
    // Register initial local worker node
    this.registerWorker({
      workerId: 'worker_local_01',
      name: 'Local Kernel Worker',
      capabilities: ['events.process', 'tools.execute', 'reasoning.plan'],
      status: 'active',
      lastHeartbeat: new Date().toISOString(),
    });
  }

  public registerWorker(worker: WorkerNode): void {
    this.workers.set(worker.workerId, worker);
    console.log(`⚙️ [WorkerRuntime] Registered Worker Node: ${worker.name} (${worker.workerId})`);
  }

  public heartbeat(workerId: string): void {
    const worker = this.workers.get(workerId);
    if (worker) {
      this.workers.set(workerId, { ...worker, lastHeartbeat: new Date().toISOString() });
    }
  }

  public getActiveWorkers(): readonly WorkerNode[] {
    return Array.from(this.workers.values()).filter(w => w.status === 'active');
  }
}
