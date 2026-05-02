import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from '../../application/workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Auth } from '../../../iam/presenters/http/decorators/auth.decorator';
import { AuthType } from '../../../common/enums/auth-type.enum';
import { ActiveUser } from '../../../iam/presenters/http/decorators/active-user.decorator';
import { WorkspaceRolesGuard } from './guards/workspace-roles.guard';
import { Roles } from './decorators/roles.decorator';
import { WorkspaceRole } from '../../domain/enums/workspace-role.enum';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('workspaces')
@ApiBearerAuth()
@Controller('workspace')
@Auth(AuthType.Bearer)
@UseGuards(WorkspaceRolesGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @ActiveUser('sub') userId: string,
  ) {
    const { name, config, icon, iconColor, invitedEmails } = createWorkspaceDto;
    return this.workspacesService.create({
      name,
      userId: userId!,
      config,
      icon,
      iconColor,
      invitedEmails,
    });
  }

  @Get('config')
  @Auth(AuthType.None)
  getConfig() {
    return this.workspacesService.getCreationMetadata();
  }

  @Get()
  findAll(@ActiveUser('sub') userId: string) {
    return this.workspacesService.findAll(userId);
  }

  @Get(':id')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER, WorkspaceRole.GUEST)
  findOne(@ActiveUser('sub') userId: string, @Param('id') id: string) {
    return this.workspacesService.findOne(userId, id);
  }

  @Patch(':id')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.workspacesService.update({
      id,
      userId: userId!,
      ...updateWorkspaceDto,
    });
  }

  @Delete(':id')
  @Roles(WorkspaceRole.OWNER)
  remove(@Param('id') id: string, @ActiveUser('sub') userId: string) {
    return this.workspacesService.remove(id, userId!);
  }
}
