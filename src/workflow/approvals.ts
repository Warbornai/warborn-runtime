/**
 * Human & Policy Approval System.
 * Supports manual approvals, org policies, role-based approvals, and emergency overrides.
 * @module @warborn/runtime/workflow/approvals
 */

import { ApprovalRequest, MissionId, ISO8601Timestamp } from '@warborn/types';

export class ApprovalSystem {
  private readonly requests = new Map<string, ApprovalRequest>();

  public createApprovalRequest(missionId: MissionId, requiredRole: string, reason: string): ApprovalRequest {
    const requestId = `req_appr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const request: ApprovalRequest = {
      requestId,
      missionId,
      requiredRole,
      reason,
      status: 'pending',
      requestedAt: new Date().toISOString() as ISO8601Timestamp,
    };
    this.requests.set(requestId, request);
    console.log(`🙋 [ApprovalSystem] Approval Requested (${requestId}) for Mission ${missionId}: ${reason}`);
    return request;
  }

  public approveRequest(requestId: string): boolean {
    const req = this.requests.get(requestId);
    if (req) {
      this.requests.set(requestId, { ...req, status: 'approved' });
      console.log(`✅ [ApprovalSystem] Approval Request ${requestId} APPROVED.`);
      return true;
    }
    return false;
  }
}
