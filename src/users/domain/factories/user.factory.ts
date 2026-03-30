import { randomUUID } from 'node:crypto';
import { User } from '../user';

export class UserFactory {
  static create(params: {
    email: string;
    id?: string;
    password?: string | null;
    fullName?: string;
    googleId?: string | null;
    isPending?: boolean;
    isActive?: boolean;
  }): User {
    const now = new Date();
    return new User(
      params.email,
      params.password ?? null,
      params.id ?? randomUUID(),
      params.fullName ?? '',
      now,
      now,
      params.isActive ?? (params.password ? true : false),
      params.googleId ?? null,
      params.isPending ?? (params.password ? false : true),
    );
  }
}
