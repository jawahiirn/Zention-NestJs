import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/application/auth.module';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/application/users.module';
import { CoffeeModule } from './coffee/coffee.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [AuthModule, CoreModule.forRoot(), UsersModule, CoffeeModule, IamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
