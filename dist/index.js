"use strict";
/**
 * @warborn/runtime - The Headless Brain & Operating System Kernel for Warborn OS
 * Central Orchestration Engine for Agents, Reasoning, Workflows, Context, Providers, Memory, and Events.
 * @packageDocumentation
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
exports.WarbornRuntimeEngine = void 0;
exports.getRuntimeEngine = getRuntimeEngine;
const brain_1 = require("./brain");
const agents_1 = require("./agents");
const context_1 = require("./context");
const memory_1 = require("./memory");
const providers_1 = require("./providers");
const workflow_1 = require("./workflow");
const events_1 = require("./events");
const security_1 = require("./security");
const config_1 = require("@warborn/config");
__exportStar(require("./brain"), exports);
__exportStar(require("./agents"), exports);
__exportStar(require("./context"), exports);
__exportStar(require("./memory"), exports);
__exportStar(require("./providers"), exports);
__exportStar(require("./workflow"), exports);
__exportStar(require("./events"), exports);
__exportStar(require("./security"), exports);
class WarbornRuntimeEngine {
    brain;
    agentRegistry;
    memoryManager;
    contextEngine;
    providerRegistry;
    workflowEngine;
    eventBus;
    policyEngine;
    config;
    constructor(config) {
        this.config = config || (0, config_1.getPlatformConfig)();
        this.brain = new brain_1.WarbornBrain(this.config);
        this.agentRegistry = new agents_1.AgentRegistry();
        this.memoryManager = new memory_1.MemoryEngine();
        this.contextEngine = new context_1.ContextEngine(this.memoryManager);
        this.providerRegistry = new providers_1.ProviderRegistry();
        this.workflowEngine = new workflow_1.WorkflowEngine();
        this.eventBus = new events_1.EventBus();
        this.policyEngine = new security_1.PolicyEngine();
    }
    /** Initialize and start the Warborn Brain Kernel */
    async start() {
        await this.eventBus.publish('system:initialized', {
            message: 'Warborn Headless Brain Engine started successfully.',
            environment: this.config.environment.mode,
        });
    }
}
exports.WarbornRuntimeEngine = WarbornRuntimeEngine;
let cachedRuntime = null;
function getRuntimeEngine() {
    if (!cachedRuntime) {
        cachedRuntime = new WarbornRuntimeEngine();
    }
    return cachedRuntime;
}
//# sourceMappingURL=index.js.map