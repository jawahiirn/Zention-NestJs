import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WorkspacesService } from '../../application/workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Auth } from '../../../iam/presenters/http/decorators/auth.decorator';
import { AuthType } from '../../../common/enums/auth-type.enum';
import { ActiveUser } from '../../../iam/presenters/http/decorators/active-user.decorator';

@Controller('workspace')
@Auth(AuthType.Bearer)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.workspacesService.create({
      ...createWorkspaceDto,
      userId: userId!,
    });
  }

  @Get()
  findAll(@ActiveUser('sub') userId: string) {
    return this.workspacesService.findAll(userId);
  }

  @Get(':id')
  findOne(@ActiveUser('sub') userId: string, @Param('id') id: string) {
    return this.workspacesService.findOne(userId, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkspaceDto: any) {
    // To be implemented
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // To be implemented
    return this.workspacesService.remove(id);
  }
}
