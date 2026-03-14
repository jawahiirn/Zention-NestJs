import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';

@Injectable()
export abstract class AuthenticationRepository {
  abstract signUp(user: User): Promise<void>;
}
