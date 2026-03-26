import { Inject, Injectable } from '@nestjs/common';
import { WorkspaceRepositoryPort } from './ports/workspace-repository.port';
import { WorkspaceFactory } from '../domain/factories/workspace.factory';
import { Workspace } from '../domain/workspace';
import { CreateWorkspaceCommand } from './commands/create-workspace.command';
import { UpdateWorkspaceCommand } from './commands/update-workspace.command';
import { UsersService } from '../../users/application/users.service';
import { CreateUserCommand } from '../../users/application/commands/create-user.command';

@Injectable()
export class WorkspacesService {
  constructor(
    @Inject(WorkspaceRepositoryPort)
    private readonly workspaceRepository: WorkspaceRepositoryPort,
    private readonly usersService: UsersService,
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

    if (command.invitedEmails && command.invitedEmails.length > 0) {
      for (const email of command.invitedEmails) {
        let user = await this.usersService.findByEmail(email);

        if (!user) {
          // Create ghost user
          user = await this.usersService.create(new CreateUserCommand(email));
        }

        const inviteeMembership = WorkspaceFactory.createMembership(
          user.id,
          workspace.id,
        );

        await this.workspaceRepository.saveMember(inviteeMembership);
      }
    }

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
