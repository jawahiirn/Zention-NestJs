import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { HashingService } from './ports/hashing.service';
import { AuthenticationController } from '../presenters/http/authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../../users/application/users.module';
import { SocialAuthenticationService } from './social-authentication.service';
import { SocialAuthenticationController } from '../presenters/http/social-authentication.controller';

@Module({
  imports: [InfrastructureModule, UsersModule],
  exports: [HashingService],
  providers: [AuthenticationService, SocialAuthenticationService],
  controllers: [AuthenticationController, SocialAuthenticationController],
})
export class IamModule {}
