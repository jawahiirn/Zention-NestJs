import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InviteMemberDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
