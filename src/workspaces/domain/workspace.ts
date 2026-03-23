export class Workspace {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly icon: string | undefined,
    public readonly iconColor: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
