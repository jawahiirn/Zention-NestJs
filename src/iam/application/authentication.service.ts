import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { HashingService } from './ports/hashing.service';
import { UserRepositoryPort } from '../../users/application/ports/user.repository.port';
import { SignUpCommand } from './commands/sign-up.command';
import { SignInCommand } from './commands/sign-in-command';
import { User } from '../../users/domain/user';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../infrastructure/config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { ActiveUserInterface } from '../../common/interfaces/active-user.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpCommand): Promise<void> {
    const hashedPassword = await this.hashingService.hash(signUpDto.password);
    const user = new User(signUpDto.email, hashedPassword);

    await this.userRepository.save(user);
  }

  async signIn(signInDto: SignInCommand): Promise<{ accessToken: string }> {
    // Repository now throws NotFoundException if user doesn't exist
    const user = await this.userRepository.findOne({ email: signInDto.email });

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      accessToken: await this.signToken(
        user.id!,
        this.jwtConfiguration.accessTokenTtl,
        { email: signInDto.email },
      ),
    };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload: T) {
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
}
