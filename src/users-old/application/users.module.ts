import { Module } from '@nestjs/common';
import { UsersInfrastructureModule } from '../infrastructure/infrastructure.module';
import { UsersService } from './users.service';

@Module({
  imports: [UsersInfrastructureModule],
  providers: [UsersService],
  exports: [UsersInfrastructureModule, UsersService],
})
export class UsersModule {}
