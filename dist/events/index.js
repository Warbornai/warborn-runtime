"use strict";
/**
 * Master Event Bus & Distributed Runtime Facade for Warborn OS.
 * Serves as the asynchronous communication backbone connecting Mission Runtime, Tool Runtime, Memory Engine, Context Engine, and Agents.
 * @module @warborn/runtime/events
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
exports.EventBus = exports.EventRuntime = void 0;
const bus_1 = require("./bus");
const broker_1 = require("./broker");
const queues_1 = require("./queues");
const workers_1 = require("./workers");
const store_1 = require("./store");
const replay_1 = require("./replay");
const scheduler_1 = require("./scheduler");
__exportStar(require("./broker"), exports);
__exportStar(require("./queues"), exports);
__exportStar(require("./workers"), exports);
__exportStar(require("./store"), exports);
__exportStar(require("./replay"), exports);
__exportStar(require("./scheduler"), exports);
__exportStar(require("./telemetry"), exports);
__exportStar(require("./bus"), exports);
class EventRuntime {
    eventStore = new store_1.EventStore();
    inMemoryBroker = new broker_1.InMemoryBroker();
    redisBroker = new broker_1.RedisBroker();
    bus = new bus_1.DistributedEventBus(this.inMemoryBroker, this.eventStore);
    queues = new queues_1.DistributedQueueSystem();
    workers = new workers_1.WorkerRuntime();
    replay = new replay_1.EventReplayEngine(this.eventStore);
    scheduler = new scheduler_1.DistributedEventScheduler();
}
exports.EventRuntime = EventRuntime;
class EventBus {
    distributedBus = new bus_1.DistributedEventBus();
    subscribe(topic, callback) {
        return this.distributedBus.subscribe(topic, async (evt) => {
            const envelope = {
                id: evt.eventId,
                topic: evt.eventType,
                source: evt.source,
                timestamp: evt.timestamp,
                payload: evt.payload,
                correlationId: evt.correlationId,
            };
            await callback(envelope);
        });
    }
    async publish(topic, payload, source = 'runtime') {
        const evt = await this.distributedBus.publish({
            eventType: topic,
            payload: payload,
            source,
        });
        return {
            id: evt.eventId,
            topic: topic,
            source: evt.source,
            timestamp: evt.timestamp,
            payload: evt.payload,
            correlationId: evt.correlationId,
        };
    }
}
exports.EventBus = EventBus;
//# sourceMappingURL=index.js.map