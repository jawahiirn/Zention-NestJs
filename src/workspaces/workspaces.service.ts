import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { IdGeneratorPort } from '../common/application/ports/id-generator.port';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { User } from '../users/entities/user.entity';
import { WorkspaceMemberRole } from './enums/workspace-roles.enum';
import { MembersService } from './members/members.service';
import { InvitationsService } from './invitations/invitations.service';
import { InvitationStatus } from './enums/invitation-status.enum';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspacesRepository: Repository<WorkspaceEntity>,
    private readonly membersService: MembersService,
    private readonly invitationsService: InvitationsService,
    @Inject(IdGeneratorPort)
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    userId: string,
    userEmail: string,
  ) {
    const { invitedEmails, name, icon, iconColor } = createWorkspaceDto;
    const workspace = this.workspacesRepository.create({
      id: this.idGenerator.generate(),
      name: name,
      icon: icon ?? null,
      iconColor: iconColor ?? null,
      createdBy: { id: userId } as User,
    });

    const savedWorkspace = await this.workspacesRepository.save(workspace);

    const selfInvitation = await this.invitationsService.createInvitation(
      { email: userEmail, workspaceId: savedWorkspace.id },
      userId,
      InvitationStatus.ACCEPTED,
    );

    // Explicitly add creator as a member
    await this.membersService.addMemberByUserId(
      savedWorkspace.id,
      userId,
      WorkspaceMemberRole.OWNER,
      selfInvitation.id,
    );

    if (invitedEmails) {
      for (const email of invitedEmails) {
        await this.invitationsService.inviteMember(
          savedWorkspace.id,
          email,
          userId,
        );
      }
    }

    return savedWorkspace;
  }

  async findAll(userId: string): Promise<WorkspaceEntity[]> {
    return this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace.members', 'member')
      .innerJoin('member.invitation', 'invitation')
      .leftJoinAndSelect('workspace.createdBy', 'creator')
      .where('member.userId = :userId', { userId })
      .andWhere('invitation.status = :status', {
        status: InvitationStatus.ACCEPTED,
      })
      .andWhere('workspace.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<WorkspaceEntity> {
    const workspace = await this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace.members', 'member')
      .where('workspace.id = :id', { id })
      .andWhere('member.userId = :userId', { userId })
      .andWhere('workspace.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('workspace.createdBy', 'creator')
      .getOne();

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return workspace;
  }

  async update(
    id: string,
    userId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.findOne(id, userId);

    this.workspacesRepository.merge(workspace, updateWorkspaceDto);

    return this.workspacesRepository.save(workspace);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.workspacesRepository.update(id, { isActive: false });
  }
}
