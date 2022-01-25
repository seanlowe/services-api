import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Utility from './utility.entity';
import { UtilityController } from './utility.controller';
import { UtilityService } from './utility.service';

@Module({
  imports: [TypeOrmModule.forFeature([Utility])],
  controllers: [UtilityController],
  providers: [UtilityService],
})

export class UtilityModule {}
