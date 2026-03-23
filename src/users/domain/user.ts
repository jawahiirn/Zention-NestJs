export class User {
  constructor(
    public email: string,
    public password: string,
    public id: string,
    public fullName: string,
    public createdAt: Date,
    public updatedAt: Date,
    public isActive: boolean,
  ) {}
}
