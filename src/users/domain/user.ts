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
    public isPending: boolean,
  ) {}

  activate(password: string, fullName?: string): User {
    return new User(
      this.email,
      password,
      this.id,
      fullName ?? this.fullName,
      this.createdAt,
      new Date(),
      true, // isActive
      this.googleId,
      false, // isPending
    );
  }
}
