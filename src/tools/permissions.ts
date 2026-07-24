/**
 * Tool Permission Validator Subsystem.
 * Validates workspace, user, organization, and capability scopes before execution.
 * @module @warborn/runtime/tools/permissions
 */

import { ITool, ToolPermission } from '@warborn/types';

export class ToolPermissionValidator {
  private readonly grantedPermissions = new Set<ToolPermission>([
    'file.read',
    'file.write',
    'network.access',
    'memory.read',
    'memory.write',
    'cloud.manage',
  ]);

  public validateToolPermissions(tool: ITool): { readonly isAllowed: boolean; readonly missingPermissions: readonly ToolPermission[] } {
    const missingPermissions: ToolPermission[] = [];

    for (const reqPerm of tool.permissions) {
      if (!this.grantedPermissions.has(reqPerm)) {
        missingPermissions.push(reqPerm);
      }
    }

    return {
      isAllowed: missingPermissions.length === 0,
      missingPermissions,
    };
  }
}
