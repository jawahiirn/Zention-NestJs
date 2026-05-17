import { WorkspaceSettings } from '../../domain/value-objects/workspace-settings.value-object';

export class CreateWorkspaceCommand {
  constructor(
    public readonly name: string,
    public readonly userId: string,
    public readonly config: WorkspaceSettings,
    public readonly icon?: string,
    public readonly iconColor?: string,
    public readonly invitedEmails?: string[],
  ) {}
}
