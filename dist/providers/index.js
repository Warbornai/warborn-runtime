"use strict";
/**
 * Multi-Provider AI Routing and Fallback Engine for Warborn OS.
 * @module @warborn/runtime/providers
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
exports.ProviderRegistry = void 0;
exports.getProviderRouter = getProviderRouter;
__exportStar(require("./types"), exports);
__exportStar(require("./middleware"), exports);
__exportStar(require("./telemetry"), exports);
__exportStar(require("./bedrock"), exports);
__exportStar(require("./router"), exports);
const router_1 = require("./router");
const bedrock_1 = require("./bedrock");
let cachedRouter = null;
function getProviderRouter() {
    if (!cachedRouter) {
        cachedRouter = new router_1.ProviderRouter();
    }
    return cachedRouter;
}
class ProviderRegistry {
    router = getProviderRouter();
    getBedrockProvider() {
        return this.router.getProvider(bedrock_1.BedrockProvider.prototype.providerType);
    }
    getActiveProvider(type) {
        return this.router.getProvider(type);
    }
    async checkHealth() {
        return this.router.checkAllHealth();
    }
}
exports.ProviderRegistry = ProviderRegistry;
//# sourceMappingURL=index.js.map