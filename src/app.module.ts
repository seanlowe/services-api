import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { UtilityModule } from './models/utility/utility.module';
import { ConfigSchema } from './validationSchema/configSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: '.env',
    validationSchema: ConfigSchema,
  }),
  DatabaseModule,
  UtilityModule
],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
