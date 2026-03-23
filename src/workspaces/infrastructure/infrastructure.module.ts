import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspaceMemberEntity } from './entities/workspace-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity, WorkspaceMemberEntity]),
  ],
  providers: [], // Repositories will be added in Phase 3 after Ports are defined
  exports: [TypeOrmModule],
})
export class InfrastructureModule {}
