import { WorkspaceRole } from './enums/workspace-role.enum';
import { WorkspaceMemberStatus } from './enums/workspace-member-status.enum';

export class WorkspaceMember {
  constructor(
    public readonly userId: string,
    public readonly workspaceId: string,
    public readonly role: WorkspaceRole,
    public readonly status: WorkspaceMemberStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  updateRole(newRole: WorkspaceRole): WorkspaceMember {
    return new WorkspaceMember(
      this.userId,
      this.workspaceId,
      newRole,
      this.status,
      this.createdAt,
      new Date(),
    );
  }

  accept(): WorkspaceMember {
    return new WorkspaceMember(
      this.userId,
      this.workspaceId,
      this.role,
      WorkspaceMemberStatus.ACTIVE,
      this.createdAt,
      new Date(),
    );
  }
}
