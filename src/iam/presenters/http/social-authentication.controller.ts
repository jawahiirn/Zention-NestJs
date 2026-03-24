import { Body, Controller, Post } from '@nestjs/common';
import { SocialAuthenticationService } from '../../application/social-authentication.service';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from '../../../common/enums/auth-type.enum';
import { GoogleTokenDto } from './dto/google-token.dto';

@Auth(AuthType.None)
@Controller('auth/google')
export class SocialAuthenticationController {
  constructor(
    private readonly socialAuthService: SocialAuthenticationService,
  ) {}

  @Post()
  async authenticate(@Body() tokenDto: GoogleTokenDto) {
    return this.socialAuthService.authenticate(tokenDto.token);
  }
}
