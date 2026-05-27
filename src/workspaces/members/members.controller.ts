import { Controller, Get, Param } from '@nestjs/common';
import { MembersService } from './members.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '../../iam/presenters/http/decorators/auth.decorator';
import { AuthType } from '../../common/enums/auth-type.enum';

@ApiTags('workspaces')
@Controller('workspaces/:workspaceId/members')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(@Param('workspaceId') workspaceId: string) {
    return this.membersService.findAllValid(workspaceId);
  }
}
