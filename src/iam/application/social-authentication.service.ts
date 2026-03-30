import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { UsersService } from '../../users/application/users.service';
import { CreateUserCommand } from '../../users/application/commands/create-user.command';

@Injectable()
export class SocialAuthenticationService implements OnModuleInit {
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    private readonly usersService: UsersService,
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

      try {
        const user = await this.usersService.findOne(googleId);
        return this.authService.generateTokens(user);
      } catch (err) {
        if (err instanceof NotFoundException) {
          // CHECK IF EMAIL ALREADY EXISTS (GHOST OR LOCAL USER)
          const existingUser = await this.usersService.findByEmail(email);

          if (existingUser) {
            // MERGE GOOGLE ACCOUNT
            const claimedUser = existingUser.claimSocial(googleId, fullName);
            await this.usersService.update(claimedUser);
            return this.authService.generateTokens(claimedUser);
          }

          // BRAND NEW USER
          const newUser = await this.usersService.create(
            new CreateUserCommand(email, null, fullName, googleId, false, true),
          );
          return this.authService.generateTokens(newUser);
        }
        throw err;
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
