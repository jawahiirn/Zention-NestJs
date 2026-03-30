import { Inject, Injectable } from '@nestjs/common';
import { WorkspaceRepositoryPort } from './ports/workspace-repository.port';
import { WorkspaceFactory } from '../domain/factories/workspace.factory';
import { Workspace } from '../domain/workspace';
import { WorkspaceMember } from '../domain/workspace-member';
import { WorkspaceMemberStatus } from '../domain/enums/workspace-member-status.enum';
import { CreateWorkspaceCommand } from './commands/create-workspace.command';
import { UpdateWorkspaceCommand } from './commands/update-workspace.command';
import { UsersService } from '../../users/application/users.service';
import { CreateUserCommand } from '../../users/application/commands/create-user.command';
import { WorkspaceMemberRepositoryPort } from './ports/workspace-member-repository.port';
import { InviteMemberCommand } from './commands/invite-member.command';
import { AcceptInvitationCommand } from './commands/accept-invitation.command';
import { UpdateMemberRoleCommand } from './commands/update-member-role.command';
import { RemoveMemberCommand } from './commands/remove-member.command';

@Injectable()
export class WorkspacesService {
  constructor(
    @Inject(WorkspaceRepositoryPort)
    private readonly workspaceRepository: WorkspaceRepositoryPort,
    @Inject(WorkspaceMemberRepositoryPort)
    private readonly workspaceMemberRepository: WorkspaceMemberRepositoryPort,
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

    const memberships: WorkspaceMember[] = [membership];

    if (command.invitedEmails && command.invitedEmails.length > 0) {
      for (const email of command.invitedEmails) {
        let user = await this.usersService.findByEmail(email);

        if (!user) {
          // Create ghost user
          user = await this.usersService.create(new CreateUserCommand(email));
        }

        if (user.id === command.userId) continue; // Skip if already the owner

        memberships.push(
          WorkspaceFactory.createMembership(user.id, workspace.id),
        );
      }
    }

    await this.workspaceMemberRepository.saveMember(memberships);

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

  async inviteMember(command: InviteMemberCommand): Promise<void> {
    const { email, workspaceId } = command;
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create(new CreateUserCommand(email));
    }

    const membership = WorkspaceFactory.createMembership(
      user.id,
      workspaceId,
      undefined, // MEMBER by default
      WorkspaceMemberStatus.PENDING,
    );

    await this.workspaceMemberRepository.saveMember([membership]);
  }

  async acceptInvitation(command: AcceptInvitationCommand): Promise<void> {
    const { userId, workspaceId } = command;

    const membership = await this.workspaceMemberRepository.findMember(
      userId,
      workspaceId,
    );

    const acceptedMembership = membership.accept();
    await this.workspaceMemberRepository.updateMember(acceptedMembership);
  }

  async updateMemberRole(command: UpdateMemberRoleCommand): Promise<void> {
    const { userId, workspaceId, newRole } = command;

    const membership = await this.workspaceMemberRepository.findMember(
      userId,
      workspaceId,
    );

    const updatedMembership = membership.updateRole(newRole);
    await this.workspaceMemberRepository.updateMember(updatedMembership);
  }

  async removeMember(command: RemoveMemberCommand): Promise<void> {
    const { userId, workspaceId } = command;
    await this.workspaceMemberRepository.deleteMember(userId, workspaceId);
  }
}
