import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../iam/presenters/http/decorators/auth.decorator';
import { AuthType } from '../../common/enums/auth-type.enum';
import { ActiveUser } from '../../iam/presenters/http/decorators/active-user.decorator';
import { AcceptedMemberGuard } from '../members/guards/accepted-member.guard';
import { InvitationsService } from './invitations.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@ApiTags('workspaces')
@Controller('workspaces/:workspaceId/invitations')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
  ) {}

  @Post()
  @UseGuards(AcceptedMemberGuard)
  async create(
    @Param('workspaceId') workspaceId: string,
    @Body() inviteMemberDto: InviteMemberDto,
    @ActiveUser('sub') inviterUserId: string,
  ) {
    return this.invitationsService.inviteMember(
      workspaceId,
      inviteMemberDto.email,
      inviterUserId,
    );
  }

  @Patch(':invitationId')
  async update(
    @Param('workspaceId') workspaceId: string,
    @Param('invitationId') invitationId: string,
    @Body() updateInvitationDto: UpdateInvitationDto,
    @ActiveUser('sub') userId: string,
    @ActiveUser('email') email: string,
  ) {
    return this.invitationsService.updateStatus(
      workspaceId,
      invitationId,
      updateInvitationDto.status,
      userId,
      email,
    );
  }
}
