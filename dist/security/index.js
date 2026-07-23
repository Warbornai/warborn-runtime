"use strict";
/**
 * Policy Engine, Workspace Manager & Identity Service.
 * @module @warborn/runtime/security
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyEngine = void 0;
class PolicyEngine {
    checkPermission(role, permission) {
        const roleStr = String(role);
        const permStr = String(permission);
        if (roleStr === 'admin' || roleStr === 'owner')
            return true;
        if (roleStr === 'member' && permStr !== 'admin:write')
            return true;
        return false;
    }
}
exports.PolicyEngine = PolicyEngine;
//# sourceMappingURL=index.js.map