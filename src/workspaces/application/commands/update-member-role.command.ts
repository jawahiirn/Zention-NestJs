import { WorkspaceRole } from '../../domain/enums/workspace-role.enum';

export class UpdateMemberRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly workspaceId: string,
    public readonly newRole: WorkspaceRole,
  ) {}
}
