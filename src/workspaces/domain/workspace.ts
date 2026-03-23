export class Workspace {
  constructor(
    public id: string,
    public name: string,
    public icon: string,
    public iconColor: string,
    public theme: string,
    public sidebarType: string,
    updatedAt: Date,
    createdAt: Date,
  ) {}
}
