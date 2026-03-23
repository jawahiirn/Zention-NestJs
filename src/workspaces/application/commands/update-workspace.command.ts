export class UpdateWorkspaceCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name?: string,
    public readonly icon?: string,
    public readonly iconColor?: string,
  ) { }
}
