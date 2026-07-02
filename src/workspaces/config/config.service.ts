import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity } from './entities/config.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>,
  ) {}

  async getConfigByKey(key: string) {
    const config = await this.configRepository.findOne({
      where: { key: key },
    });
    return config ? config.config : null;
  }
}
