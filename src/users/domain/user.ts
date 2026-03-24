export class User {
  constructor(
    public email: string,
    public password: string | null,
    public id: string,
    public fullName: string,
    public createdAt: Date,
    public updatedAt: Date,
    public isActive: boolean,
    public googleId: string | null,
  ) {}
}
