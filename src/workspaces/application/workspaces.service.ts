import { Inject, Injectable } from '@nestjs/common';
import { WorkspaceRepositoryPort } from './ports/workspace-repository.port';
import { WorkspaceFactory } from '../domain/factories/workspace.factory';
import { Workspace } from '../domain/workspace';
import { CreateWorkspaceCommand } from './commands/create-workspace.command';
import { UpdateWorkspaceCommand } from './commands/update-workspace.command';

@Injectable()
export class WorkspacesService {
  constructor(
    @Inject(WorkspaceRepositoryPort)
    private readonly workspaceRepository: WorkspaceRepositoryPort,
  ) {}

  async create(command: CreateWorkspaceCommand): Promise<Workspace> {
    const { workspace, membership } = WorkspaceFactory.create(
      command.name,
      command.userId,
      command.icon,
      command.iconColor,
    );

    await this.workspaceRepository.save(workspace);
    await this.workspaceRepository.saveMember(membership);

    return workspace;
  }

  findAll(userId: string): Promise<Workspace[]> {
    return this.workspaceRepository.findAllByUserId(userId);
  }

  findOne(userId: string, id: string): Promise<Workspace> {
    return this.workspaceRepository.findById(userId, id);
  }

  async update(command: UpdateWorkspaceCommand): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findById(
      command.userId,
      command.id,
    );

    const updatedWorkspace = workspace.update(command);

    await this.workspaceRepository.save(updatedWorkspace);

    return updatedWorkspace;
  }

  async remove(id: string, userId: string): Promise<void> {
    // Verify participation and existence
    await this.workspaceRepository.findById(userId, id);
    await this.workspaceRepository.remove(id);
  }
}
