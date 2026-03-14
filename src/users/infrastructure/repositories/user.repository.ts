import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticationRepository } from '../../application/ports/authentication.repository';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../domain/user';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements AuthenticationRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signUp(user: User): Promise<void> {
    const persistenceModel = UserMapper.toPersistence(user);
    try {
      await this.userRepository.save(persistenceModel);
    } catch (err) {
      // TODO: Keep this somewhere else, it could be re-used elsewhere.
      const pgUniqueViolationErrorCOde = '23505';
      if (err.code === pgUniqueViolationErrorCOde) {
        throw new ConflictException();
      }
      throw err;
    }
  }
}
