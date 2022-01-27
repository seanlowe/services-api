import { Controller, Get, Query } from "@nestjs/common";
import { VersionService } from "./version.service";

@Controller('versions')
export class VersionController {
    constructor(private readonly versionService: VersionService) {}

    @Get()
    async get(@Query() query: object) {
        return this.versionService.get(query);
    }
}
