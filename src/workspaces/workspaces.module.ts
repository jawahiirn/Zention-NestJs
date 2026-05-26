import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspaceEntity } from './entities/workspace.entity';
import { MembersModule } from './members/members.module';
import { InvitationsModule } from './invitations/invitations.module';
import { WorkspaceMemberEntity } from './members/entities/workspace-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity, WorkspaceMemberEntity]),
    MembersModule,
    InvitationsModule,
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
