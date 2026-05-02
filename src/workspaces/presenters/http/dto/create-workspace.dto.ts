import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { WorkspaceSettings } from '../../../domain/interfaces/workspace-settings.interface';
import { WorkspacePurpose } from '../../../domain/enums/workspace-purpose.enum';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'My Workspace' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: { purpose: WorkspacePurpose.WORK, integrations: ['slack'] },
    description: 'Modular configuration including purpose and integrations',
  })
  @IsObject()
  @IsNotEmpty()
  config: WorkspaceSettings;

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
