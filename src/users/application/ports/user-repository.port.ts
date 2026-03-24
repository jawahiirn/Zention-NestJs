import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';

export type UserCriteria = {
  id?: string;
  email?: string;
  googleId?: string;
};

@Injectable()
export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<void>;
  abstract findOne(criteria: UserCriteria): Promise<User>;
}
