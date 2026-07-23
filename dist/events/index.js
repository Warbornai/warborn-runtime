"use strict";
/**
 * Decoupled In-Memory Event Bus & PubSub Adapter Engine.
 * @module @warborn/runtime/events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
class EventBus {
    listeners = new Map();
    subscribe(topic, callback) {
        if (!this.listeners.has(topic)) {
            this.listeners.set(topic, new Set());
        }
        this.listeners.get(topic).add(callback);
        return () => {
            this.listeners.get(topic)?.delete(callback);
        };
    }
    async publish(topic, payload, source = 'runtime') {
        const envelope = {
            id: `evt_${Date.now()}`,
            topic,
            payload,
            timestamp: new Date().toISOString(),
            source,
        };
        const callbacks = this.listeners.get(topic);
        if (callbacks) {
            for (const cb of callbacks) {
                await cb(envelope);
            }
        }
        return envelope;
    }
}
exports.EventBus = EventBus;
//# sourceMappingURL=index.js.map