import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { AuthType } from '../common/enums/auth-type.enum';
import { Auth } from '../iam/presenters/http/decorators/auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUser } from '../iam/presenters/http/decorators/active-user.decorator';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

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
  async findOne(
    @Param('id') id: string,
    @ActiveUser('sub') userId: string,
  ) {
    return this.workspacesService.findOne(id, userId);
  }

  @Get()
  findAll(@ActiveUser('sub') userId: string) {
    return this.workspacesService.findAll(userId);
  }
}
