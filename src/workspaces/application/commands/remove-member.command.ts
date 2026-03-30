export class RemoveMemberCommand {
  constructor(
    public readonly userId: string,
    public readonly workspaceId: string,
  ) {}
}
