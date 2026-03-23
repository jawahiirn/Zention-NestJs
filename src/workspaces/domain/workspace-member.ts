import { WorkspaceRole } from './workspace-role.enum';
import { WorkspaceMemberStatus } from './workspace-member-status.enum';

export class WorkspaceMember {
  constructor(
    public readonly userId: string,
    public readonly workspaceId: string,
    public readonly role: WorkspaceRole,
    public readonly status: WorkspaceMemberStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
