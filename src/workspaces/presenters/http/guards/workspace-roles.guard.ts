import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from '../../../../common/constants/iam.constants';
import { WorkspaceRole } from '../../../domain/enums/workspace-role.enum';
import { WorkspaceRepositoryPort } from '../../../application/ports/workspace-repository.port';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { WorkspaceMemberRepositoryPort } from '../../../application/ports/workspace-member-repository.port';

@Injectable()
export class WorkspaceRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(WorkspaceMemberRepositoryPort)
    private readonly workspaceMemberRepository: WorkspaceMemberRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<WorkspaceRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!contextRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];
    const workspaceId = request.params.id;

    if (!user || !workspaceId) {
      return false;
    }

    try {
      const member = await this.workspaceMemberRepository.findMember(
        user.sub,
        workspaceId,
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
        // We throw Forbidden because the user doesn't even HAVE a membership
        throw new ForbiddenException('User is not a member of this workspace');
      }
      throw error;
    }
  }
}
