"use strict";
/**
 * Multi-Provider AI Routing and Fallback Engine.
 * @module @warborn/runtime/providers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRegistry = void 0;
const types_1 = require("@warborn/types");
const config_1 = require("@warborn/config");
class ProviderRegistry {
    providers = new Map();
    constructor() {
        const platformConfig = (0, config_1.getPlatformConfig)();
        this.registerFromConfig(platformConfig);
    }
    registerFromConfig(config) {
        if (config.providers.openai.enabled) {
            this.providers.set(types_1.ProviderType.OPENAI, {
                providerId: types_1.ProviderType.OPENAI,
                name: 'OpenAI',
                type: types_1.ProviderType.OPENAI,
                baseUrl: config.providers.openai.baseUrl,
                enabled: true,
                capabilities: { streaming: true, functionCalling: true, vision: true },
            });
        }
    }
    getProvider(type) {
        return this.providers.get(type);
    }
}
exports.ProviderRegistry = ProviderRegistry;
//# sourceMappingURL=index.js.map