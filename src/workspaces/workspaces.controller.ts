import { Controller } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { AuthType } from '../common/enums/auth-type.enum';
import { Auth } from '../iam/presenters/http/decorators/auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('workspaces')
@Controller('workspaces')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}
}
