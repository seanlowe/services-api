import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Utility from './utility.entity';
import { UtilityController } from './utility.controller';
import { UtilityService } from './utility.service';
import { VersionModule } from '../versions/version.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Utility]),
    VersionModule
  ],
  controllers: [UtilityController],
  providers: [UtilityService],
})

export class UtilityModule {}
