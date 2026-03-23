import { Inject, Injectable } from '@nestjs/common';
import { WorkspaceRepositoryPort } from './ports/workspace-repository.port';
import { WorkspaceFactory } from '../domain/factories/workspace.factory';
import { Workspace } from '../domain/workspace';

@Injectable()
export class WorkspacesService {
  constructor(
    @Inject(WorkspaceRepositoryPort)
    private readonly workspaceRepository: WorkspaceRepositoryPort,
  ) {}

  async create(createParams: {
    name: string;
    userId: string;
    icon?: string;
    iconColor?: string;
  }): Promise<Workspace> {
    const { workspace, membership } = WorkspaceFactory.create(
      createParams.name,
      createParams.userId,
      createParams.icon,
      createParams.iconColor,
    );

    await this.workspaceRepository.save(workspace);
    await this.workspaceRepository.saveMember(membership);

    return workspace;
  }

  findAll(userId: string): Promise<Workspace[]> {
    return this.workspaceRepository.findAllByUserId(userId);
  }

  findOne(id: string): Promise<Workspace> {
    return this.workspaceRepository.findById(id);
  }

  update(id: string, updateWorkspaceDto: any) {
    // To be implemented
    return `This action updates a #${id} workspace`;
  }

  remove(id: string) {
    // To be implemented
    return `This action removes a #${id} workspace`;
  }
}
