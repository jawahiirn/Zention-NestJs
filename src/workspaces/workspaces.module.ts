import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspaceEntity } from './entities/workspace.entity';
import { MembersModule } from './members/members.module';
import { InvitationsModule } from './invitations/invitations.module';
import { ConfigModule } from './config/config.module';
import { WorkspaceMemberEntity } from './members/entities/workspace-member.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity, WorkspaceMemberEntity]),
    MembersModule,
    UsersModule,
    InvitationsModule,
    ConfigModule,
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
