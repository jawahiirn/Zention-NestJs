import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;
}
