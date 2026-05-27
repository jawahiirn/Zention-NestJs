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
import { UsersService } from '../users/users.service';
import { InvitationsService } from './invitations/invitations.service';
import { InvitationStatus } from './enums/invitation-status.enum';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspacesRepository: Repository<WorkspaceEntity>,
    private readonly membersService: MembersService,
    private readonly usersService: UsersService,
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

    // TODO: Create a method to invite & create a member
    if (invitedEmails) {
      for (const email of invitedEmails) {
        let createdUser: User | null = null;
        const user = await this.usersService.findByEmail(email);
        // User does not exist in our system. So create temporary user
        if (!user) {
          createdUser = await this.usersService.create(
            {
              email,
            },
            true,
          );
        } else {
          createdUser = user;
        }
        const invitation = await this.invitationsService.createInvitation(
          { email, workspaceId: workspace.id },
          userId,
          InvitationStatus.PENDING,
        );
        await this.membersService.addMemberByUserId(
          savedWorkspace.id,
          createdUser.id,
          WorkspaceMemberRole.MEMBER,
          invitation.id,
        );
      }
    }

    return savedWorkspace;
  }

  async findAll(userId: string): Promise<WorkspaceEntity[]> {
    return this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace.members', 'member')
      .where('member.userId = :userId', { userId })
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<WorkspaceEntity> {
    const workspace = await this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace.members', 'member')
      .where('workspace.id = :id', { id })
      .andWhere('member.userId = :userId', { userId })
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
