import { Controller, Get, Param } from "@nestjs/common";
import { VersionService } from "./version.service";

@Controller('versions')
export class VersionController {
    constructor(private readonly versionService: VersionService) {}

    @Get()
    async get() {
        return this.versionService.get();
    }
}
