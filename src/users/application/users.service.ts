import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryPort } from './ports/user-repository.port';
import { User } from '../domain/user';
import { UserFactory } from '../domain/factories/user.factory';
import { CreateUserCommand } from './commands/create-user.command';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async create(command: CreateUserCommand): Promise<User> {
    const user = UserFactory.create(command);
    await this.userRepository.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ email });
    } catch (err) {
      if (err instanceof NotFoundException) {
        return null;
      }
      throw err;
    }
  }

  async findOne(googleId: string): Promise<User> {
    return this.userRepository.findOne({ googleId });
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async update(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
