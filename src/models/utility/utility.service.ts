import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Utility from "./utility.entity";
import CreateUtilityDto from "./create.dto";
import UpdateUtilityDto from "./update.dto";
import { VersionService } from "../versions/version.service";


@Injectable()
export class UtilityService {
    constructor(
        @InjectRepository(Utility) private repo: Repository<Utility>,
        private readonly versionService: VersionService
    ) {}

    /**
     * @returns 
     */
    get() {
        return this.repo.find();
    }

    /**
     * @param query 
     * 
     * @returns 
     */
    async getAndFilter(query) {
        console.log(query);
        // const queryBuilder = this.repo.createQueryBuilder("")


        // findByUsername(username: string): Promise<User | undefined> {
        //     const user = getRepository(User)
        //       .createQueryBuilder("user")
        //       .where("user.username = :username", { username: username })
        //       .getOne();
        
        //     return user;
        //   }

        return [];
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
     * @param id 
     * 
     * @returns 
     */
    getVersionsByUtility(id: number) {
        return this.versionService.getVersionsByUtilityId(id);
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
        const oldUtil = await this.getUtilityById(id);
        if (!oldUtil) {
            throw new HttpException('No Utility Found by that ID', HttpStatus.NOT_FOUND);
        }

        this.versionService.create(oldUtil);
        
        await this.repo.update(id, util);
        const updatedUtil = await this.repo.findOne(id);

        return updatedUtil;
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
