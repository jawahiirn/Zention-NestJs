import { Module } from '@nestjs/common';
import { HashingService } from './application/ports/hashing.service';
import { BcryptService } from './infrastructure/repositories/bcrypt.service';
import { AuthenticationController } from './presenters/http/authentication.controller';
import { AuthenticationService } from './application/authentication.service';
import { UsersModule } from '../users/application/users.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './infrastructure/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './presenters/http/guards/access-token.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamInfrastructureModule {}
