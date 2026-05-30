import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { REQUEST_USER_KEY } from '../../../common/constants/iam.constants';
import { MembersService } from '../members.service';

@Injectable()
export class AcceptedMemberGuard implements CanActivate {
  constructor(private readonly membersService: MembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];
    const workspaceId = request.params.workspaceId || request.params.id;

    if (!user || !workspaceId) return false;

    const member = await this.membersService.findOneAccepted(
      workspaceId,
      user.sub,
    );
    if (!member) {
      throw new ForbiddenException(
        'Only accepted members can access this resource',
      );
    }
    return true;
  }
}
