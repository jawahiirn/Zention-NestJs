import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationEntity } from './entities/invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InvitationStatus } from '../enums/invitation-status.enum';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { MembersService } from '../members/members.service';
import { WorkspaceMemberRole } from '../enums/workspace-roles.enum';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(InvitationEntity)
    private readonly invitationsRepository: Repository<InvitationEntity>,
    private readonly usersService: UsersService,
    private readonly membersService: MembersService,
  ) {}

  async updateStatus(
    workspaceId: string,
    invitationId: string,
    status: InvitationStatus,
    userId: string,
    userEmail: string,
  ) {
    const invitation = await this.invitationsRepository.findOne({
      where: { id: invitationId, workspace: { id: workspaceId } },
      relations: ['workspace', 'invitedBy'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    if (!invitation.workspace.isActive) {
      throw new NotFoundException('Workspace not found or was deleted');
    }

    if (
      status === InvitationStatus.ACCEPTED ||
      status === InvitationStatus.DECLINED
    ) {
      if (invitation.email !== userEmail) {
        throw new ForbiddenException(
          'You are not authorized or do not have sufficient permissions.',
        );
      }
    }

    if (status === InvitationStatus.REVOKED) {
      const isInviter = invitation.invitedBy?.id === userId;
      const isAdminOrOwner = await this.membersService
        .findOneValid(workspaceId, userId)
        .then((member) =>
          [WorkspaceMemberRole.OWNER, WorkspaceMemberRole.ADMIN].includes(
            member.role,
          ),
        )
        .catch(() => false);

      if (!isInviter && !isAdminOrOwner) {
        throw new ForbiddenException(
          'You are not authorized or do not have sufficient permissions.',
        );
      }
    }

    if (status === InvitationStatus.ACCEPTED) {
      const user = await this.usersService.findByEmail(invitation.email);
      if (user) {
        user.isPending = false;
        await this.usersService.update(user);
      }
    }

    invitation.status = status;
    return this.invitationsRepository.save(invitation);
  }

  async inviteMember(
    workspaceId: string,
    email: string,
    inviterUserId: string,
    role: WorkspaceMemberRole = WorkspaceMemberRole.MEMBER,
  ) {
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({ email }, true);
    }

    const invitation = await this.createInvitation(
      { email, workspaceId },
      inviterUserId,
      InvitationStatus.PENDING,
      role,
    );

    await this.membersService.addMemberByUserId(
      workspaceId,
      user.id,
      role,
      invitation.id,
    );

    return invitation;
  }

  createInvitation(
    createInvitationDto: CreateInvitationDto,
    inviterUserId: string,
    status: InvitationStatus = InvitationStatus.PENDING,
    role?: WorkspaceMemberRole,
  ) {
    const { email, workspaceId } = createInvitationDto;
    const invitation = this.invitationsRepository.create({
      workspace: { id: workspaceId },
      email,
      invitedBy: { id: inviterUserId } as User,
      status,
      role: role ?? null,
    });
    return this.invitationsRepository.save(invitation);
  }

  async findWorkspaceInvitations(workspaceId: string) {
    return this.invitationsRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: ['workspace', 'invitedBy'],
    });
  }

  async findUserInvitations(email: string) {
    return this.invitationsRepository.find({
      where: {
        email,
        status: In([InvitationStatus.PENDING]),
        workspace: { isActive: true },
      },
      relations: ['workspace', 'invitedBy'],
    });
  }
}
