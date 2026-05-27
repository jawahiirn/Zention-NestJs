import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from './entities/invitation.entity';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { MembersModule } from '../members/members.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvitationEntity]),
    MembersModule,
    UsersModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
