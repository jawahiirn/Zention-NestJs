import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { AuthenticationRepository } from '../application/ports/authentication.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: AuthenticationRepository,
      useClass: UserRepository,
    },
  ],
  exports: [TypeOrmModule, AuthenticationRepository],
})
export class InfrastructureModule {}
