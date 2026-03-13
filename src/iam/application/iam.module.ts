import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { HashingService } from './ports/hashing.service';

@Module({
  imports: [InfrastructureModule],
  exports: [HashingService],
})
export class IamModule {}
