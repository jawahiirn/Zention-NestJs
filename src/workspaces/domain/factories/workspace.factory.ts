import { Workspace } from '../workspace';
import { WorkspaceMember } from '../workspace-member';
import { WorkspaceRole } from '../enums/workspace-role.enum';
import { WorkspaceMemberStatus } from '../enums/workspace-member-status.enum';

import { WorkspaceSettings } from '../value-objects/workspace-settings.value-object';

export class WorkspaceFactory {
  static create(
    id: string,
    name: string,
    ownerId: string,
    ownerMembershipId: string,
    config: WorkspaceSettings,
    icon?: string,
    iconColor?: string,
  ): { workspace: Workspace; membership: WorkspaceMember } {
    const now = new Date();

    const workspace = new Workspace(
      id,
      name,
      config,
      icon ?? '',
      iconColor ?? '',
      now,
      now,
    );

    const membership = new WorkspaceMember(
      ownerMembershipId,
      ownerId,
      id,
      WorkspaceRole.OWNER,
      WorkspaceMemberStatus.ACTIVE,
      now,
      now,
    );

    return { workspace, membership };
  }

  static createMembership(
    id: string,
    userId: string,
    workspaceId: string,
    role: WorkspaceRole = WorkspaceRole.MEMBER,
    status: WorkspaceMemberStatus = WorkspaceMemberStatus.PENDING,
  ): WorkspaceMember {
    const now = new Date();
    return new WorkspaceMember(id, userId, workspaceId, role, status, now, now);
  }
}
