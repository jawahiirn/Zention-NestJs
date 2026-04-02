import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateWorkspaceDto {
  @ApiProperty({ example: 'Updated Workspace', required: false })
  @IsString()
  @IsOptional()
  @MinLength(1)
  name?: string;

  @ApiProperty({ example: 'updated-workspace-icon.png', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: '#00ff00', required: false })
  @IsString()
  @IsOptional()
  iconColor?: string;
}
