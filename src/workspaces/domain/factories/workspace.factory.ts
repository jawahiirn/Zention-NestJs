import { randomUUID } from 'node:crypto';
import { Workspace } from '../workspace';
import { WorkspaceMember } from '../workspace-member';
import { WorkspaceRole } from '../enums/workspace-role.enum';
import { WorkspaceMemberStatus } from '../enums/workspace-member-status.enum';

export class WorkspaceFactory {
  static create(
    name: string,
    ownerId: string,
    icon?: string,
    iconColor?: string,
  ): { workspace: Workspace; membership: WorkspaceMember } {
    const workspaceId = randomUUID();
    const now = new Date();

    const workspace = new Workspace(
      workspaceId,
      name,
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
}
