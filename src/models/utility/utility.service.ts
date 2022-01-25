import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Utility from "./utility.entity";
import { Repository } from "typeorm";
import CreateUtilityDto from "./create.dto";
import UpdateUtilityDto from "./update.dto";


@Injectable()
export class UtilityService {
    constructor(@InjectRepository(Utility) private repo: Repository<Utility>) {}

    /**
     * @returns 
     */
    get() {
        return this.repo.find();
    }

    /**
     * @param id 
     * 
     * @returns 
     */
    async getUtilityById(id: number) {
        const util = await this.repo.findOne(id)

        if (util) {
            return util;
        }

        throw new HttpException('No Utility Found by that ID', HttpStatus.NOT_FOUND)
    }

    /**
     * @param utility 
     * 
     * @returns 
     */
    async create(utility: CreateUtilityDto): Promise<Utility> {
        const newUtil = await this.repo.create(utility);
        await this.repo.save(newUtil);

        return newUtil;
    }

    /**
     * @param id 
     * @param util 
     * 
     * @returns 
     */
    async update(id: number, util: UpdateUtilityDto): Promise<Utility> {
        await this.repo.update(id, util);
        const updatedUtil = await this.repo.findOne(id);

        if (updatedUtil) {
            return updatedUtil;
        }

        throw new HttpException('No Utility Found by that ID', HttpStatus.NOT_FOUND)
    }
    
    /**
     * @param id 
     */
    async delete(id: number) {
        const deletedUtil = await this.repo.delete(id);
        
        if (!deletedUtil.affected) {
            throw new HttpException('No Utility Found by that ID', HttpStatus.NOT_FOUND)
        }
    }
}
