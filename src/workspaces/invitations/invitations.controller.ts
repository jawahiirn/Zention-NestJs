import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../iam/presenters/http/decorators/auth.decorator';
import { AuthType } from '../../common/enums/auth-type.enum';
import { ActiveUser } from '../../iam/presenters/http/decorators/active-user.decorator';
import { AcceptedMemberGuard } from '../members/guards/accepted-member.guard';
import { WorkspaceRolesGuard } from '../guards/workspace-role.guard';
import { Roles } from '../decorators/roles.decorator';
import { WorkspaceMemberRole } from '../enums/workspace-roles.enum';
import { InvitationsService } from './invitations.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@Controller()
@ApiTags('invitations')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('workspaces/:workspaceId/invitations')
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
      inviteMemberDto.role,
    );
  }

  @Patch('workspaces/:workspaceId/invitations/:invitationId')
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

  @Get('workspaces/:workspaceId/invitations')
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.ADMIN)
  @UseGuards(WorkspaceRolesGuard)
  async findAll(@Param('workspaceId') workspaceId: string) {
    return this.invitationsService.findWorkspaceInvitations(workspaceId);
  }

  @Get('invitations/me')
  async findMyInvitations(@ActiveUser('email') email: string) {
    return this.invitationsService.findUserInvitations(email);
  }
}
