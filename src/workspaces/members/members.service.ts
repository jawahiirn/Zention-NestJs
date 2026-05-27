import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { WorkspaceMemberEntity } from './entities/workspace-member.entity';
import { User } from '../../users/entities/user.entity';
import { WorkspaceMemberRole } from '../enums/workspace-roles.enum';
import { InvitationStatus } from '../enums/invitation-status.enum';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(WorkspaceMemberEntity)
    private readonly membersRepository: Repository<WorkspaceMemberEntity>,
  ) {}

  /*
   Return valid workspace member => Status Pending | Accepted
 */
  async findOneValid(workspaceId: string, userId: string) {
    const member = await this.membersRepository.findOne({
      where: {
        workspace: { id: workspaceId },
        user: { id: userId },
        invitation: {
          status: In([InvitationStatus.PENDING, InvitationStatus.ACCEPTED]),
        },
      },
    });

    if (!member) {
      throw new NotFoundException('User is not a member of this workspace');
    }

    return member;
  }

  /*
    Return valid workspace members => Status Pending | Accepted
  */
  async findAllValid(workspaceId: string) {
    return this.membersRepository.find({
      where: [
        { workspace: { id: workspaceId }, invitation: IsNull() },
        {
          workspace: { id: workspaceId },
          invitation: {
            status: In([InvitationStatus.PENDING, InvitationStatus.ACCEPTED]),
          },
        },
      ],
      relations: ['user', 'invitation'],
    });
  }

  async addMemberByUserId(
    workspaceId: string,
    userId: string,
    role: WorkspaceMemberRole,
    invitationId: string,
  ) {
    const member = this.membersRepository.create({
      workspace: { id: workspaceId },
      user: { id: userId } as User,
      role,
      invitation: { id: invitationId },
    });
    return this.membersRepository.save(member);
  }

  async findOneAccepted(workspaceId: string, userId: string) {
    return this.membersRepository.findOne({
      where: {
        workspace: { id: workspaceId },
        user: { id: userId },
        invitation: { status: InvitationStatus.ACCEPTED },
      },
    });
  }

  async findById(workspaceId: string, memberId: string) {
    const member = await this.membersRepository.findOne({
      where: [
        { id: memberId, workspace: { id: workspaceId }, invitation: IsNull() },
        {
          id: memberId,
          workspace: { id: workspaceId },
          invitation: {
            status: In([InvitationStatus.PENDING, InvitationStatus.ACCEPTED]),
          },
        },
      ],
      relations: ['user', 'invitation'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  private async assertCanModifyMember(
    workspaceId: string,
    memberId: string,
    callerUserId: string,
  ) {
    const [target, caller] = await Promise.all([
      this.findById(workspaceId, memberId),
      this.findOneValid(workspaceId, callerUserId),
    ]);

    if (target.role === WorkspaceMemberRole.OWNER) {
      throw new ForbiddenException(
        'You do not have the permission for this operation',
      );
    }

    if (
      caller.role === WorkspaceMemberRole.ADMIN &&
      target.role === WorkspaceMemberRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You do not have the permission for this operation',
      );
    }

    return target;
  }

  async updateRole(
    workspaceId: string,
    memberId: string,
    role: WorkspaceMemberRole,
    callerUserId: string,
  ) {
    const target = await this.assertCanModifyMember(
      workspaceId,
      memberId,
      callerUserId,
    );

    target.role = role;
    return this.membersRepository.save(target);
  }

  async remove(workspaceId: string, memberId: string, callerUserId: string) {
    const target = await this.assertCanModifyMember(
      workspaceId,
      memberId,
      callerUserId,
    );

    await this.membersRepository.remove(target);
  }
}
