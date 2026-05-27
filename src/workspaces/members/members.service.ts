import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceMemberEntity } from './entities/workspace-member.entity';
import { User } from '../../users/entities/user.entity';
import { WorkspaceMemberRole } from '../enums/workspace-roles.enum';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(WorkspaceMemberEntity)
    private readonly membersRepository: Repository<WorkspaceMemberEntity>,
  ) {}

  async findOne(workspaceId: string, userId: string) {
    const member = await this.membersRepository.findOne({
      where: {
        workspace: { id: workspaceId },
        user: { id: userId },
      },
    });

    if (!member) {
      throw new NotFoundException('User is not a member of this workspace');
    }

    return member;
  }

  async findAll(workspaceId: string) {
    return this.membersRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: ['user'],
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
