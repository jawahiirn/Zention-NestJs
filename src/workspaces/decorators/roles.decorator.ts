import { SetMetadata } from '@nestjs/common';
import { WorkspaceMemberRole } from '../enums/workspace-roles.enum';

export const ROLES_KEY = 'workspace_roles';
export const Roles = (...roles: WorkspaceMemberRole[]) =>
  SetMetadata(ROLES_KEY, roles);
