import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import CreateUtilityDto from "./create.dto";
import UpdateUtilityDto from "./update.dto";
import { UtilityService } from "./utility.service";

@Controller('utility')
export class UtilityController {
    constructor(private readonly utilityService: UtilityService) {}

    @Get()
    get(@Query() query: object) {
        return this.utilityService.get(query);
    }

    @Get(':id')
    getUtilityById(@Param('id') id: string) {
        return this.utilityService.getUtilityById(Number(id));
    }

    @Get('/:id/versions')
    getVersionsByUtility(@Param('id') id: string) {
        return this.utilityService.getVersionsByUtility(Number(id));
    }

    @Post()
    async create(@Body() util: CreateUtilityDto) {
        return this.utilityService.create(util);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() util: UpdateUtilityDto) {
        return this.utilityService.update(Number(id), util);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.utilityService.delete(Number(id));
    }
}
