import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserRepositoryPort } from '../application/ports/user-repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: UserRepositoryPort,
      useClass: UserRepository,
    },
  ],
  exports: [TypeOrmModule, UserRepositoryPort],
})
export class UsersInfrastructureModule {}
