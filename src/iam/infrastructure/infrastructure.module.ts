import { Module } from '@nestjs/common';
import { BcryptService } from './repositories/bcrypt.service';
import { HashingService } from '../application/ports/hashing.service';

@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [HashingService],
})
export class InfrastructureModule {}
