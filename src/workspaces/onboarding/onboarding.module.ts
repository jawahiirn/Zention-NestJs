import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { OnboardingConfigEntity } from './entities/onboarding-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OnboardingConfigEntity])],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
