import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { HashingService } from './ports/hashing.service';
import { AuthenticationController } from '../presenters/http/authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../../users/application/users.module';

@Module({
  imports: [InfrastructureModule, UsersModule],
  exports: [HashingService],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class IamModule {}
