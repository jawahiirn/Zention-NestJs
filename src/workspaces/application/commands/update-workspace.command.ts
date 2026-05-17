import { WorkspaceSettings } from '../../domain/value-objects/workspace-settings.value-object';

export class UpdateWorkspaceCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name?: string,
    public readonly settings?: WorkspaceSettings,
    public readonly icon?: string,
    public readonly iconColor?: string,
  ) { }
}
