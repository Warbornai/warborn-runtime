"use strict";
/**
 * Policy Engine, Workspace Manager & Identity Service.
 * @module @warborn/runtime/security
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyEngine = void 0;
class PolicyEngine {
    checkPermission(role, permission) {
        if (role === 'admin' || role === 'owner')
            return true;
        if (role === 'member' && permission !== 'admin:write')
            return true;
        return false;
    }
}
exports.PolicyEngine = PolicyEngine;
//# sourceMappingURL=index.js.map