export class AcceptInvitationCommand {
  constructor(
    public readonly userId: string,
    public readonly workspaceId: string,
  ) {}
}
