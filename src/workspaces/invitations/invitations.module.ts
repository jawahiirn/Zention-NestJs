import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from './entities/invitation.entity';
import { InvitationsService } from './invitations.service';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationEntity])],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
