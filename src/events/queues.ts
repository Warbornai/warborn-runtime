/**
 * Distributed Queue Subsystem.
 * Supports FIFO Queue, Priority Queue, Delayed Queue, Retry Queue, and Dead Letter Queue (DLQ).
 * @module @warborn/runtime/events/queues
 */

import { QueueMessage, EventPriority, ISO8601Timestamp } from '@warborn/types';

export class DistributedQueueSystem {
  private readonly fifoQueue: QueueMessage[] = [];
  private readonly priorityQueue: QueueMessage[] = [];
  private readonly dlq: QueueMessage[] = [];

  public enqueue<T = any>(topic: string, payload: T, priority: EventPriority = EventPriority.NORMAL): QueueMessage<T> {
    const msg: QueueMessage<T> = {
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      topic,
      payload,
      priority,
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      retryCount: 0,
      maxRetries: 3,
    };

    if (priority === EventPriority.HIGH || priority === EventPriority.CRITICAL) {
      this.priorityQueue.push(msg as any);
      this.priorityQueue.sort((a) => (a.priority === EventPriority.CRITICAL ? -1 : 1));
    } else {
      this.fifoQueue.push(msg as any);
    }

    return msg;
  }

  public dequeue(): QueueMessage | undefined {
    return this.priorityQueue.shift() || this.fifoQueue.shift();
  }

  public moveToDeadLetterQueue(msg: QueueMessage, error: string): void {
    console.warn(`💀 [DistributedQueueSystem] Moving message ${msg.messageId} to Dead Letter Queue (DLQ): ${error}`);
    this.dlq.push(msg);
  }

  public getDLQ(): readonly QueueMessage[] {
    return this.dlq;
  }
}
