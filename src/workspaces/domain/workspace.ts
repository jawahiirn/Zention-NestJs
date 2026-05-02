import { WorkspaceSettings } from './interfaces/workspace-settings.interface';

export class Workspace {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly settings: WorkspaceSettings,
    public readonly icon: string | undefined,
    public readonly iconColor: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  update(params: {
    name?: string;
    settings?: WorkspaceSettings;
    icon?: string;
    iconColor?: string;
  }): Workspace {
    return new Workspace(
      this.id,
      params.name ?? this.name,
      params.settings ?? this.settings,
      params.icon ?? this.icon,
      params.iconColor ?? this.iconColor,
      this.createdAt,
      new Date(),
    );
  }
}
