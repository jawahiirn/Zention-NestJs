import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMemberEntity } from './entities/workspace-member.entity';
import { User } from '../../users/entities/user.entity';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { InvitationEntity } from '../invitations/entities/invitation.entity';
import { AcceptedMemberGuard } from './guards/accepted-member.guard';
import { WorkspaceRolesGuard } from '../guards/workspace-role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceMemberEntity, User, InvitationEntity]),
  ],
  controllers: [MembersController],
  providers: [MembersService, AcceptedMemberGuard, WorkspaceRolesGuard],
  exports: [MembersService, WorkspaceRolesGuard],
})
export class MembersModule {}
