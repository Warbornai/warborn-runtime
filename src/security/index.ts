/**
 * Policy Engine, Workspace Manager & Identity Service.
 * @module @warborn/runtime/security
 */

import { UserRole, Permission } from '@warborn/types/auth';

export class PolicyEngine {
  public checkPermission(role: UserRole, permission: Permission): boolean {
    if (role === 'admin' || role === 'owner') return true;
    if (role === 'member' && permission !== 'admin:write') return true;
    return false;
  }
}
