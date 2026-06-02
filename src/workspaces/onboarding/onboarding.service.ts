import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnboardingConfigEntity } from './entities/onboarding-config.entity';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(OnboardingConfigEntity)
    private readonly configRepository: Repository<OnboardingConfigEntity>,
  ) {}

  async getConfig() {
    const config = await this.configRepository.findOne({
      where: { key: 'default' },
    });
    return config ? config.config : null;
  }
}
