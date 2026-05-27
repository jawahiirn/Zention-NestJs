import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '../../iam/presenters/http/decorators/auth.decorator';
import { AuthType } from '../../common/enums/auth-type.enum';
import { AcceptedMemberGuard } from './guards/accepted-member.guard';
import { ActiveUser } from '../../iam/presenters/http/decorators/active-user.decorator';
import { UpdateMemberDto } from './dto/update-member.dto';

@ApiTags('members')
@Controller('workspaces/:workspaceId/members')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
@UseGuards(AcceptedMemberGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(@Param('workspaceId') workspaceId: string) {
    return this.membersService.findAllValid(workspaceId);
  }

  @Get(':memberId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.membersService.findById(workspaceId, memberId);
  }

  @Patch(':memberId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.membersService.updateRole(
      workspaceId,
      memberId,
      updateMemberDto.role,
      userId,
    );
  }

  @Delete(':memberId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
    @ActiveUser('sub') userId: string,
  ) {
    return this.membersService.remove(workspaceId, memberId, userId);
  }
}
