import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/application/users.module';
import { IamInfrastructureModule } from './iam/iam-infrastructure.module';
import { WorkspacesModule } from './workspaces/application/workspaces.module';

@Module({
  imports: [
    CoreModule.forRoot(),
    UsersModule,
    IamInfrastructureModule,
    WorkspacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
