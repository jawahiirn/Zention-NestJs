import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../iam/presenters/http/decorators/auth.decorator';
import { AuthType } from '../../common/enums/auth-type.enum';

@ApiTags('config')
@Controller('config')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':key')
  @ApiParam({
    name: 'key',
    description: 'The configuration identifier (e.g., "default" for onboarding, "member-roles" for roles)',
    example: 'member-roles',
  })
  async getConfig(@Param('key') key: string) {
    return this.configService.getConfigByKey(key);
  }
}
