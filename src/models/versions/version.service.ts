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
     * Retrieve all Versions in the database.
     * 
     * @returns Promise<Version[]>
     */
    get(): Promise<Version[]> {
        return this.repo.find();
    }

    /**
     * Retrieves any Version associated with the Utility id passed in.
     * 
     * @param utility_id 
     * 
     * @returns Promise<Version[]>
     */
    async getVersionsByUtilityId(utility_id: number): Promise<Version[]> {
        const versions = await this.repo.createQueryBuilder("version")
            .where("version.utility_id = :utility_id", { utility_id })
            .getMany();

        if (versions) {
            return versions;
        }

        throw new HttpException('No Utility Found by that ID', HttpStatus.NOT_FOUND);
    }

    /**
     * Creates a new Version record from the passed in Utility 
     * in the database, then returns the new record.
     * 
     * @param oldUtil 
     * 
     * @returns Promise<Version>
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
