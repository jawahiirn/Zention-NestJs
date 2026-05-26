import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from './entities/invitation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationEntity])],
})
export class InvitationsModule {}
