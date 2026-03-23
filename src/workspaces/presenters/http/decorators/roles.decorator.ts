import { SetMetadata } from '@nestjs/common';
import { WorkspaceRole } from '../../../domain/enums/workspace-role.enum';

export const ROLES_KEY = 'workspace_roles';
export const Roles = (...roles: WorkspaceRole[]) => SetMetadata(ROLES_KEY, roles);
