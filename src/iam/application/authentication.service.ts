import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { HashingService } from './ports/hashing.service';
import { UserRepositoryPort } from '../../users/application/ports/user.repository.port';
import { SignUpCommand } from './commands/sign-up.command';
import { SignInCommand } from './commands/sign-in-command';
import { User } from '../../users/domain/user';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async signUp(signUpDto: SignUpCommand): Promise<void> {
    const hashedPassword = await this.hashingService.hash(signUpDto.password);
    const user = new User(signUpDto.email, hashedPassword);

    await this.userRepository.save(user);
  }

  async signIn(signInDto: SignInCommand): Promise<void> {
    // Repository now throws NotFoundException if user doesn't exist
    const user = await this.userRepository.findOne({ email: signInDto.email });

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    // TODO: Generate JWT / Access Token here
  }
}
