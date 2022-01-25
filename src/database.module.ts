import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [ path.join(__dirname, '/models/**/*.entity.{ts,js}')],
        migrations: [ path.join(__dirname, '/migrations/*.{ts,js}')],
        cli: {
          entitiesDir: "src/models/**",
          migrationsDir: "src/migrations",
        },
        ssl: false,
        synchronize: true,
      }),
    }),
  ],
})

export class DatabaseModule {}
