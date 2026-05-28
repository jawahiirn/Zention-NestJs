import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IdGeneratorPort } from '../common/application/ports/id-generator.port';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(IdGeneratorPort)
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async create(dto: CreateUserDto, isPending?: boolean): Promise<User> {
    const user = new User();
    Object.assign(user, dto);
    user.id = this.idGenerator.generate();
    user.joinedAt = new Date();
    if (isPending !== undefined) {
      user.isPending = isPending;
    }
    try {
      return await this.userRepository.save(user);
    } catch (err: any) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { googleId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(user: User): Promise<void> {
    try {
      await this.userRepository.save(user);
    } catch (err: any) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }
}
