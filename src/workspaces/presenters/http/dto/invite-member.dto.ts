import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InviteMemberDto {
  @ApiProperty({ example: 'new-member@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
