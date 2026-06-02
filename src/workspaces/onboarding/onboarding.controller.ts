import { Controller, Get } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../iam/presenters/http/decorators/auth.decorator';
import { AuthType } from '../../common/enums/auth-type.enum';

@ApiTags('onboarding')
@Controller('onboarding')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('config')
  async getConfig() {
    return this.onboardingService.getConfig();
  }
}
