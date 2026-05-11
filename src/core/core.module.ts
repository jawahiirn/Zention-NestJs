import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { IdGeneratorPort } from '../common/application/ports/id-generator.port';
import { SnowflakeIdGeneratorAdapter } from './id-generation/snowflake-id-generator.adapter';

@Global()
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
    const providers = [
      {
        provide: IdGeneratorPort,
        useClass: SnowflakeIdGeneratorAdapter,
      },
    ];

    return {
      module: CoreModule,
      imports,
      providers,
      exports: [IdGeneratorPort],
    };
  }
}