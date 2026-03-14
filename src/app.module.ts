import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/application/users.module';
import { CoffeeModule } from './coffee/coffee.module';
import { IamInfrastructureModule } from './iam/iam-infrastructure.module';

@Module({
  imports: [
    CoreModule.forRoot(),
    UsersModule,
    CoffeeModule,
    IamInfrastructureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
