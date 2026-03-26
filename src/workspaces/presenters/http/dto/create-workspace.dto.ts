import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  iconColor?: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  invitedEmails?: string[];
}
