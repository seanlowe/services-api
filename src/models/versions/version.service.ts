import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass, classToPlainFromExist } from "class-transformer";
import { Repository } from "typeorm";
import Utility from "../utility/utility.entity";
import CreateVersionDto from "./create.dto";
import Version from "./version.entity";

@Injectable()
export class VersionService {
    constructor(@InjectRepository(Version) private repo: Repository<Version>) {}

    /**
     * @returns 
     */
    get() {
        return this.repo.find();
    }

    /**
     * @param utility_id 
     * 
     * @returns 
     */
    async getVersionsByUtilityId(utility_id: number) {
        const versions = await this.repo.createQueryBuilder("version")
            .where("version.utility_id = :utility_id", { utility_id })
            .getMany();

        if (versions) {
            // return JSON.stringify(versions);
            return versions;
        }

        throw new HttpException('No Utility Found by that ID', HttpStatus.NOT_FOUND);
    }

    /**
     * @param oldUtil 
     * 
     * @returns 
     */
    async create(oldUtil: Utility): Promise<Version> {
        const plain = classToPlainFromExist(oldUtil, CreateVersionDto);
        const dto = plainToClass(CreateVersionDto, plain);

        const newVersion = this.repo.create(dto);
        newVersion.utility_ = oldUtil;
        await this.repo.insert(newVersion);

        return newVersion;
    }

}
