import { randomUUID } from 'node:crypto';
import { Workspace } from '../workspace';
import { WorkspaceMember } from '../workspace-member';
import { WorkspaceRole } from '../enums/workspace-role.enum';
import { WorkspaceMemberStatus } from '../enums/workspace-member-status.enum';

import { WorkspaceSettings } from '../interfaces/workspace-settings.interface';

export class WorkspaceFactory {
  static create(
    name: string,
    ownerId: string,
    config: WorkspaceSettings,
    icon?: string,
    iconColor?: string,
  ): { workspace: Workspace; membership: WorkspaceMember } {
    const workspaceId = randomUUID();
    const now = new Date();

    const workspace = new Workspace(
      workspaceId,
      name,
      config,
      icon ?? '',
      iconColor ?? '',
      now,
      now,
    );

    const membership = new WorkspaceMember(
      ownerId,
      workspaceId,
      WorkspaceRole.OWNER,
      WorkspaceMemberStatus.ACTIVE,
      now,
      now,
    );

    return { workspace, membership };
  }

  static createMembership(
    userId: string,
    workspaceId: string,
    role: WorkspaceRole = WorkspaceRole.MEMBER,
    status: WorkspaceMemberStatus = WorkspaceMemberStatus.PENDING,
  ): WorkspaceMember {
    const now = new Date();
    return new WorkspaceMember(userId, workspaceId, role, status, now, now);
  }
}
