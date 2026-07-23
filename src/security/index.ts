/**
 * Policy Engine, Workspace Manager & Identity Service.
 * @module @warborn/runtime/security
 */

import { UserRole, Permission } from '@warborn/types';

export class PolicyEngine {
  public checkPermission(role: UserRole, permission: Permission): boolean {
    const roleStr = String(role);
    const permStr = String(permission);
    if (roleStr === 'admin' || roleStr === 'owner') return true;
    if (roleStr === 'member' && permStr !== 'admin:write') return true;
    return false;
  }
}
