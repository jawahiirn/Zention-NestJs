import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspaceMemberEntity } from './entities/workspace-member.entity';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceRepositoryPort } from '../application/ports/workspace-repository.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity, WorkspaceMemberEntity]),
  ],
  providers: [
    {
      provide: WorkspaceRepositoryPort,
      useClass: WorkspaceRepository,
    },
  ],
  exports: [TypeOrmModule, WorkspaceRepositoryPort],
})
export class InfrastructureModule {}
