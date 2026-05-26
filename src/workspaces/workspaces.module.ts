import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspaceEntity } from './entities/workspace.entity';
import { MembersModule } from './members/members.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity]), MembersModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
