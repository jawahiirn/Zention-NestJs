import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @ApiProperty({ example: 'your-google-id-token-here' })
  @IsNotEmpty()
  token: string;
}
