import {
  ConflictException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { UserRepositoryPort } from '../../users/application/ports/user-repository.port';
import { randomUUID } from 'node:crypto';
import { User } from '../../users/domain/user';

@Injectable()
export class SocialAuthenticationService implements OnModuleInit {
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  onModuleInit(): any {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.oauth2Client = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(token: string): Promise<any> {
    try {
      const loginTicket = await this.oauth2Client.verifyIdToken({
        idToken: token,
      });
      const {
        name: fullName,
        sub: googleId,
        email,
      } = loginTicket.getPayload() || {};

      if (!googleId || !email || !fullName) {
        throw new Error('Google login failed due to missing variables.');
      }

      const user = await this.userRepository.findOne({ id: googleId });
      // if user exists, return token else create a new user.
      if (user) {
        return this.authService.generateTokens(user);
      } else {
        const newUser = new User(
          email,
          null, // Password is null for social users
          randomUUID(),
          fullName,
          new Date(),
          new Date(),
          true, // isActive
          googleId,
        );
        return this.userRepository.save(newUser);
      }
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      } else {
        throw new Error(err.message);
      }
    }
  }
}
