import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from '../presenters/http/workspaces.controller';
import { WorkspaceMembersController } from '../presenters/http/workspace-members.controller';
import { WorkspacesInfrastructureModule } from '../infrastructure/infrastructure.module';
import { UsersModule } from '../../users/application/users.module';

@Module({
  imports: [WorkspacesInfrastructureModule, UsersModule],
  controllers: [WorkspacesController, WorkspaceMembersController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
