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
import { AuthenticationGuard } from './presenters/http/guards/authentication.guard';
import { AccessTokenGuard } from './presenters/http/guards/access-token.guard';
import { RefreshTokenStoragePort } from './application/ports/refresh-token-storage.port';
import { RefreshTokenIdsStorage } from './infrastructure/storage/refresh-token.storage';
import { SocialAuthenticationController } from './presenters/http/social-authentication.controller';

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
      useClass: AuthenticationGuard,
    },
    {
      provide: RefreshTokenStoragePort,
      useClass: RefreshTokenIdsStorage,
    },
    AccessTokenGuard,
    AuthenticationService,
  ],
  controllers: [AuthenticationController, SocialAuthenticationController],
  exports: [RefreshTokenStoragePort],
})
export class IamInfrastructureModule {}
