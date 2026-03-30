export class InviteMemberCommand {
  constructor(
    public readonly email: string,
    public readonly workspaceId: string,
    public readonly invitedBy: string,
  ) {}
}
