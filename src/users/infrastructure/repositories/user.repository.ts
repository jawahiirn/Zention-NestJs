import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  UserRepositoryPort,
  UserCriteria,
} from '../../application/ports/user-repository.port';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../domain/user';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const persistenceModel = UserMapper.toPersistence(user);
    try {
      await this.userRepository.save(persistenceModel);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async findOne(criteria: UserCriteria): Promise<User> {
    const entity = await this.userRepository.findOne({
      where: criteria as FindOptionsWhere<UserEntity>,
    });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toDomain(entity);
  }
}
