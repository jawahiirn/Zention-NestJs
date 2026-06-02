import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnboardingConfigEntity } from './entities/onboarding-config.entity';

@Injectable()
export class OnboardingService implements OnModuleInit {
  constructor(
    @InjectRepository(OnboardingConfigEntity)
    private readonly configRepository: Repository<OnboardingConfigEntity>,
  ) {}

  async onModuleInit() {
    await this.seedConfig();
  }

  private async seedConfig() {
    const existing = await this.configRepository.findOne({
      where: { key: 'default' },
    });
    if (!existing) {
      const defaultConfig = {
        steps: [
          {
            id: 'purpose',
            label: 'What purpose do you want to create this workspace for?',
            shortDescription: 'Select the primary use case for this workspace.',
            type: 'select',
            required: true,
            options: [
              { label: 'Work', value: 'work' },
              { label: 'School', value: 'school' },
              { label: 'Personal', value: 'personal' },
            ],
          },
        ],
      };
      await this.configRepository.save({
        key: 'default',
        config: defaultConfig,
      });
    }
  }

  async getConfig() {
    const config = await this.configRepository.findOne({
      where: { key: 'default' },
    });
    return config ? config.config : null;
  }
}
