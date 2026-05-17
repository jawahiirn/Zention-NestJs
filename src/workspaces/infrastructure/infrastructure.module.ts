import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspaceMemberEntity } from './entities/workspace-member.entity';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceRepositoryPort } from '../application/ports/workspace-repository.port';
import { WorkspaceMemberRepositoryPort } from '../application/ports/workspace-member-repository.port';
import { WorkspaceConfigPort } from '../application/ports/workspace-config.port';
import { WorkspaceConfigService } from './services/workspace-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity, WorkspaceMemberEntity])],
  providers: [
    {
      provide: WorkspaceRepositoryPort,
      useClass: WorkspaceRepository,
    },
    {
      provide: WorkspaceMemberRepositoryPort,
      useExisting: WorkspaceRepositoryPort,
    },
    {
      provide: WorkspaceConfigPort,
      useClass: WorkspaceConfigService,
    },
  ],
  exports: [
    TypeOrmModule,
    WorkspaceRepositoryPort,
    WorkspaceMemberRepositoryPort,
    WorkspaceConfigPort,
  ],
})
export class WorkspacesInfrastructureModule {}
