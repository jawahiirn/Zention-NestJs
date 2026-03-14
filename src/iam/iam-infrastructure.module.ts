import { Module } from '@nestjs/common';
import { HashingService } from './application/ports/hashing.service';
import { BcryptService } from './infrastructure/repositories/bcrypt.service';
import { AuthenticationController } from './presenters/http/authentication.controller';
import { AuthenticationService } from './application/authentication.service';
import { UsersModule } from '../users/application/users.module';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamInfrastructureModule {}
