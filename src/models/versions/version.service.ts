import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass, classToPlainFromExist } from "class-transformer";
import { Repository } from "typeorm";
import { BaseService } from "../base.service";
import Utility from "../utility/utility.entity";
import CreateVersionDto from "./create.dto";
import Version from "./version.entity";

@Injectable()
export class VersionService extends BaseService {
    constructor(@InjectRepository(Version) private repo: Repository<Version>) {
        super();
    }

    /**
     * Retrieve all Versions in the database.
     * 
     * @returns Promise<Version[]>
     */
    async get(query: object): Promise<Object> {
        this.handleQuery(query)

        return this.find()
    }

    /**
     * Handles pagination for retrieving Versions
     * 
     * @param query 
     */
    handleQuery(query: object) {
        this.page = 1;
        if (Object.entries(query).length !== 0) {
            for (let entry in query) {
                switch (entry) {
                    case 'page':
                        this.page = Number(query[entry]);
                        continue;
                    default:
                        continue;
                }
            }
        }
    }

    /**
     * Find all Version records that match the applicable options
     * 
     * @param option 
     * 
     * @returns 
     */
    async find(options: object = {}): Promise<Object> {
        let results = [];
        const orderById = {
            order: {
                id: 'ASC',
            }
        };

        Object.assign(options, orderById);
        results = await this.repo.find(options);
        const paginated_results = this.paginate(results);

        return this.buildResponse(paginated_results);
    }

    /**
     * Retrieves any Version associated with the Utility id passed in.
     * 
     * @param utility_id 
     * 
     * @returns Promise<Object>
     */
    async getVersionsByUtilityId(utility_id: number, query: object): Promise<Object> {
        this.handleQuery(query);
        const option = {
            where: {
                utility_: utility_id,
            },
        };

        return this.find(option);
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
