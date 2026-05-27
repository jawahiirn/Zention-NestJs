import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { WorkspaceMemberRole } from '../../enums/workspace-roles.enum';

export class UpdateMemberDto {
  @ApiProperty({
    enum: WorkspaceMemberRole,
    example: WorkspaceMemberRole.MEMBER,
  })
  @IsEnum(WorkspaceMemberRole)
  @IsNotEmpty()
  role: WorkspaceMemberRole;
}
