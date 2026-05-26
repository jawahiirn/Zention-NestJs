import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { IdGeneratorPort } from '../common/application/ports/id-generator.port';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspacesRepository: Repository<WorkspaceEntity>,
    @Inject(IdGeneratorPort)
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userId: string) {
    const workspace = this.workspacesRepository.create({
      id: this.idGenerator.generate(),
      name: createWorkspaceDto.name,
      icon: createWorkspaceDto.icon ?? null,
      iconColor: createWorkspaceDto.iconColor ?? null,
      createdBy: { id: userId } as User,
    });

    return this.workspacesRepository.save(workspace);
  }
}
