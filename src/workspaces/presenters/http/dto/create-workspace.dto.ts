import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'My Workspace' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'workspace-icon.png', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: '#ff0000', required: false })
  @IsString()
  @IsOptional()
  iconColor?: string;

  @ApiProperty({ example: ['user1@example.com', 'user2@example.com'], required: false })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  invitedEmails?: string[];
}
