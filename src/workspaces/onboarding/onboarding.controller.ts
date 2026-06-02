import { Controller, Get } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('config')
  async getConfig() {
    return this.onboardingService.getConfig();
  }
}
