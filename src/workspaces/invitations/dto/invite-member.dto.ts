import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { WorkspaceMemberRole } from '../../enums/workspace-roles.enum';

export class InviteMemberDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: WorkspaceMemberRole, required: false })
  @IsOptional()
  @IsEnum(WorkspaceMemberRole)
  role?: WorkspaceMemberRole;
}
