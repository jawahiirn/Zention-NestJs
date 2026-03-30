import { IsEnum, IsNotEmpty } from 'class-validator';
import { WorkspaceRole } from '../../../domain/enums/workspace-role.enum';

export class UpdateMemberRoleDto {
  @IsEnum(WorkspaceRole)
  @IsNotEmpty()
  role: WorkspaceRole;
}
