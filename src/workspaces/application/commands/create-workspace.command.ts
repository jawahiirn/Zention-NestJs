export class CreateWorkspaceCommand {
  constructor(
    public readonly name: string,
    public readonly userId: string,
    public readonly icon?: string,
    public readonly iconColor?: string,
  ) {}
}
