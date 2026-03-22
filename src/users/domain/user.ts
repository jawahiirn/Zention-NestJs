/*
 * TODO: The right way of DDD is that, the system generates the unique Ids,
 *  not the database / infrastructure layer. This would solve the problem for
 *  type safety for user objects and a clear definition for the system.
 * */
export class User {
  constructor(
    public email: string,
    public password: string,
    public id?: number,
  ) {}
}
