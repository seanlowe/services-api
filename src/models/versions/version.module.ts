import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VersionController } from "./version.controller";
import Version from "./version.entity";
import { VersionService } from "./version.service";

@Module({
    imports: [TypeOrmModule.forFeature([Version])],
    controllers: [VersionController],
    providers: [VersionService],
    exports: [VersionService]
})

export class VersionModule {}
