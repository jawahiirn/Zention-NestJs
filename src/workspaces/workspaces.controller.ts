import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { AuthType } from '../common/enums/auth-type.enum';
import { Auth } from '../iam/presenters/http/decorators/auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUser } from '../iam/presenters/http/decorators/active-user.decorator';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceMemberRole } from './enums/workspace-roles.enum';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Roles } from './decorators/roles.decorator';

@ApiTags('workspaces')
@Controller('workspaces')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.workspacesService.create(createWorkspaceDto, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @ActiveUser('sub') userId: string) {
    return this.workspacesService.findOne(id, userId);
  }

  @Get()
  findAll(@ActiveUser('sub') userId: string) {
    return this.workspacesService.findAll(userId);
  }

  @Patch(':id')
  @Roles(WorkspaceMemberRole.OWNER, WorkspaceMemberRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.workspacesService.update(id, userId, updateWorkspaceDto);
  }
}
