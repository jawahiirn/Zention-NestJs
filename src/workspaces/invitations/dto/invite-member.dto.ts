import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { WorkspaceMemberRole } from '../../enums/workspace-roles.enum';

export class InviteMemberDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** Role to assign upon acceptance. Available: OWNER, ADMIN, MEMBER, GUEST */
  @ApiProperty({
    enum: WorkspaceMemberRole,
    enumName: 'WorkspaceMemberRole',
    required: false,
    example: WorkspaceMemberRole.MEMBER,
  })
  @IsOptional()
  @IsEnum(WorkspaceMemberRole)
  role?: WorkspaceMemberRole;
}
