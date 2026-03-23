export class Workspace {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly icon: string,
    public readonly iconColor: string,
    public readonly theme: string,
    public readonly sidebarType: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
