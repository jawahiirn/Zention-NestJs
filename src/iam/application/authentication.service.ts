import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { HashingService } from './ports/hashing.service';
import { SignUpCommand } from './commands/sign-up.command';
import { SignInCommand } from './commands/sign-in-command';
import { User } from '../../users/domain/user';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../infrastructure/config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { ActiveUserInterface } from '../../common/interfaces/active-user.interface';
import { RefreshTokenCommand } from './commands/refresh-token.command';
import { RefreshTokenStoragePort } from './ports/refresh-token-storage.port';
import { randomUUID } from 'node:crypto';
import { InvalidatedRefreshTokenError } from '../infrastructure/storage/refresh-token.storage';
import { UsersService } from '../../users/application/users.service';
import { CreateUserCommand } from '../../users/application/commands/create-user.command';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(RefreshTokenStoragePort)
    private readonly refreshTokenIdsStorage: RefreshTokenStoragePort,
  ) {}

  async signUp(signUpDto: SignUpCommand): Promise<void> {
    const { email, password, fullName } = signUpDto;
    const hashedPassword = await this.hashingService.hash(password);

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      if (existingUser.isPending) {
        // ACTIVATE GHOST USER
        const activatedUser = existingUser.activate(hashedPassword, fullName);
        await this.usersService.update(activatedUser);
        return;
      }
      // REAL USER ALREADY EXISTS
      throw new ConflictException('User already exists');
    }

    await this.usersService.create(
      new CreateUserCommand(email, hashedPassword, fullName),
    );
  }

  async signIn(
    signInDto: SignInCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isEqual = user.password
      ? await this.hashingService.compare(signInDto.password, user.password)
      : false;

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    return await this.generateTokens(user);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenCommand) {
    try {
      // sub = User ID
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserInterface, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.usersService.findById(sub);
      await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId);
      await this.refreshTokenIdsStorage.invalidate(user.id);

      return await this.generateTokens(user);
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }
}
