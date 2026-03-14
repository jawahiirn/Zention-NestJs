import { Injectable, Inject } from '@nestjs/common';
import { HashingService } from './ports/hashing.service';
import { AuthenticationRepository } from '../../users/application/ports/authentication.repository';
import { SignUpCommand } from './commands/sign-up.command';
import { User } from '../../users/domain/user';
import { SignInCommand } from './commands/sign-in-command';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    @Inject(AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async signUp(signUpDto: SignUpCommand): Promise<void> {
    const hashedPassword = await this.hashingService.hash(signUpDto.password);
    const user = new User(signUpDto.email, hashedPassword);

    await this.authenticationRepository.signUp(user);
  }
}
