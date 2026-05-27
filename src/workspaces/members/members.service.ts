import { Injectable, NotFoundException } from '@nestjs/common';
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
}
