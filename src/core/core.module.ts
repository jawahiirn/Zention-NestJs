import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({})
export class CoreModule {
  static forRoot() {
    const imports =
      [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT || '5432', 10),
          password: process.env.DATABASE_PASSWORD,
          username: process.env.DATABASE_USER,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
        }),]
    return {
      module: CoreModule,
      imports,
    };
  }
}