import { WorkspaceSettings } from '../../domain/interfaces/workspace-settings.interface';

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
