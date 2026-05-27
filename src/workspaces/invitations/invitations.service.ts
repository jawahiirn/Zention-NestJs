import { Injectable } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationEntity } from './entities/invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async inviteMember(
    workspaceId: string,
    email: string,
    inviterUserId: string,
  ) {
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({ email }, true);
    }

    const invitation = await this.createInvitation(
      { email, workspaceId },
      inviterUserId,
    );

    await this.membersService.addMemberByUserId(
      workspaceId,
      user.id,
      WorkspaceMemberRole.MEMBER,
      invitation.id,
    );

    return invitation;
  }

  createInvitation(
    createInvitationDto: CreateInvitationDto,
    inviterUserId: string,
    status: InvitationStatus = InvitationStatus.PENDING,
  ) {
    const { email, workspaceId } = createInvitationDto;
    const invitation = this.invitationsRepository.create({
      workspace: { id: workspaceId },
      email,
      invitedBy: { id: inviterUserId } as User,
      status,
    });
    return this.invitationsRepository.save(invitation);
  }
}
