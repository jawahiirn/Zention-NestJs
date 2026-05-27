import { Injectable } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationEntity } from './entities/invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvitationStatus } from '../enums/invitation-status.enum';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(InvitationEntity)
    private readonly invitationsRepository: Repository<InvitationEntity>,
  ) {}

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
