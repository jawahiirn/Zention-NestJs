export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password?: string | null,
    public readonly fullName?: string,
    public readonly googleId?: string | null,
    public readonly isPending?: boolean,
    public readonly isActive?: boolean,
  ) {}
}
