import { Module } from '@nestjs/common';
import { HashingService } from './application/ports/hashing.service';
import { BcryptService } from './infrastructure/repositories/bcrypt.service';

@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class IamModule {}
