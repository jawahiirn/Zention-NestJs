import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from '../presenters/workspaces.controller';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
