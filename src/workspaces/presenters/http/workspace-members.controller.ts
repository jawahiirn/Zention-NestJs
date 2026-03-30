import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from '../../application/workspaces.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { Auth } from '../../../iam/presenters/http/decorators/auth.decorator';
import { AuthType } from '../../../common/enums/auth-type.enum';
import { ActiveUser } from '../../../iam/presenters/http/decorators/active-user.decorator';
import { WorkspaceRolesGuard } from './guards/workspace-roles.guard';
import { Roles } from './decorators/roles.decorator';
import { WorkspaceRole } from '../../domain/enums/workspace-role.enum';
import { InviteMemberCommand } from '../../application/commands/invite-member.command';
import { UpdateMemberRoleCommand } from '../../application/commands/update-member-role.command';
import { RemoveMemberCommand } from '../../application/commands/remove-member.command';
import { AcceptInvitationCommand } from '../../application/commands/accept-invitation.command';

@Controller('workspace/:id/members')
@Auth(AuthType.Bearer)
@UseGuards(WorkspaceRolesGuard)
export class WorkspaceMembersController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post('invite')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  async invite(
    @Param('id') workspaceId: string,
    @Body() inviteMemberDto: InviteMemberDto,
    @ActiveUser('sub') invitedBy: string,
  ) {
    return this.workspacesService.inviteMember(
      new InviteMemberCommand(inviteMemberDto.email, workspaceId, invitedBy),
    );
  }

  @Post('accept')
  async accept(
    @Param('id') workspaceId: string,
    @ActiveUser('sub') userId: string,
  ) {
    return this.workspacesService.acceptInvitation(
      new AcceptInvitationCommand(userId, workspaceId),
    );
  }

  @Patch(':userId/role')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  async updateRole(
    @Param('id') workspaceId: string,
    @Param('userId') targetUserId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    return this.workspacesService.updateMemberRole(
      new UpdateMemberRoleCommand(
        targetUserId,
        workspaceId,
        updateMemberRoleDto.role,
      ),
    );
  }

  @Delete(':userId')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  async remove(
    @Param('id') workspaceId: string,
    @Param('userId') targetUserId: string,
  ) {
    return this.workspacesService.removeMember(
      new RemoveMemberCommand(targetUserId, workspaceId),
    );
  }
}
