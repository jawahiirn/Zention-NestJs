import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from '../presenters/http/workspaces.controller';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { UsersModule } from '../../users/application/users.module';

@Module({
  imports: [InfrastructureModule, UsersModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
