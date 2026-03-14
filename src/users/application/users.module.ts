import { Module } from '@nestjs/common';
import { UsersController } from '../presenters/http/users.controller';

import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { UsersService } from './users.service';

@Module({
  imports: [InfrastructureModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [InfrastructureModule],
})
export class UsersModule {}
