import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { REQUEST_USER_KEY } from '../../common/constants/iam.constants';
import { MembersService } from '../members/members.service';
import { WorkspaceMemberRole } from '../enums/workspace-roles.enum';

@Injectable()
export class WorkspaceRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly membersService: MembersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<
      WorkspaceMemberRole[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!contextRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];
    const workspaceId = request.params.id || request.params.workspaceId;

    if (!user || !workspaceId) {
      return false;
    }

    try {
      const member = await this.membersService.findOneValid(
        workspaceId,
        user.sub,
      );

      const hasRole = contextRoles.includes(member.role);
      if (!hasRole) {
        throw new ForbiddenException(
          `User requires one of the following roles: ${contextRoles.join(', ')}`,
        );
      }
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new ForbiddenException('User is not a member of this workspace');
      }
      throw error;
    }
  }
}
