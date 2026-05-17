import { WorkspaceSettings } from './value-objects/workspace-settings.value-object';

export class Workspace {
  readonly settings: WorkspaceSettings;

  constructor(
    public readonly id: string,
    public readonly name: string,
    settings: WorkspaceSettings,
    public readonly icon: string | undefined,
    public readonly iconColor: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isActive: boolean = true,
  ) {
    this.settings = settings instanceof WorkspaceSettings
      ? settings
      : WorkspaceSettings.fromJSON(settings);
  }

  update(params: {
    name?: string;
    settings?: WorkspaceSettings;
    icon?: string;
    iconColor?: string;
  }): Workspace {
    const updatedSettings = params.settings
      ? (params.settings instanceof WorkspaceSettings
        ? params.settings
        : WorkspaceSettings.fromJSON(params.settings))
      : this.settings;

    return new Workspace(
      this.id,
      params.name ?? this.name,
      updatedSettings,
      params.icon ?? this.icon,
      params.iconColor ?? this.iconColor,
      this.createdAt,
      new Date(),
      this.isActive,
    );
  }

  delete(): Workspace {
    return new Workspace(
      this.id,
      this.name,
      this.settings,
      this.icon,
      this.iconColor,
      this.createdAt,
      new Date(),
      false,
    );
  }
}
