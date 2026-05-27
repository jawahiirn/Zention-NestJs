import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { InvitationStatus } from '../../enums/invitation-status.enum';

export class UpdateInvitationDto {
  @ApiProperty({ enum: InvitationStatus, example: InvitationStatus.ACCEPTED })
  @IsEnum(InvitationStatus)
  @IsNotEmpty()
  status: InvitationStatus;
}
