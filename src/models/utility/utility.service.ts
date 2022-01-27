import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { VersionService } from "../versions/version.service";
import Utility from "./utility.entity";
import Version from "../versions/version.entity";
import CreateUtilityDto from "./create.dto";
import UpdateUtilityDto from "./update.dto";


@Injectable()
export class UtilityService {
    constructor(
        @InjectRepository(Utility) private repo: Repository<Utility>,
        private readonly versionService: VersionService
    ) {}

    private results_per_page = 5;
    private page = -1;
    private total_records = -1;

    /**
     * Gets all applicable records according to the passed in query
     * and returns a response containing the records and some metadata.
     * 
     * @param query 
     * 
     * @returns Promise<Object>
     */
    async get(query: object): Promise<Object> {
        let results = null;
        this.page = 1;
        
        if (Object.entries(query).length === 0) {
            results = await this.find();
        } else {
            results = await this.handleQuery(query);
        }

        return this.buildResponse(results);
    }

    /**
     * Handles parsing the query parameters and makes calls to build
     * the options to be handed into this.find()
     * 
     * @param query 
     * 
     * @returns Promise<Utility[]>
     */
    private async handleQuery(query: object): Promise<Utility[]> {
        let options = {};

        for (let entry in query) {
            switch (entry) {
                case 'filter':
                    Object.assign(options, this.buildFilterOptions(query[entry]));
                    continue;
                case 'page':
                    this.page = Number(query[entry]);
                    continue;
                case 'results_per_page':
                    this.results_per_page = Number(query[entry]);
                    continue;
                case 'sort':
                    Object.assign(options, this.buildSortOptions(query[entry]));
                    continue;
                default:
                    continue;
            }
        }

        return this.find(options);
    }

    /**
     * The function that actually does the fetching of records, and returns the
     * appropriately paginated records.
     * 
     * @param options 
     * 
     * @returns Promise<Utility[]>
     */
    private async find(options: object|undefined = undefined): Promise<Utility[]> {
        let results = null;

        // if we have no pre-existing options, add a sort by id
        // This means that even with no other options, we will 
        // at least get a list sorted in ascending order by id

        if (options === undefined) {
            options = {
                order: {
                    id: 'ASC',
                },
            };
        }

        results = await this.repo.find(options);

        return this.paginate(results);
    }

    /**
     * Handles pagination for the list of records passed in
     * 
     * @param results 
     * 
     * @returns Utility[]
     */
    private paginate(results: Utility[]|Version[]): Utility[]|Version[] {
        this.total_records = results.length;

        const offset = (this.page - 1) * this.results_per_page;
        const records_on_page = results.slice(offset, offset+this.results_per_page);

        return records_on_page;
    }

    /**
     * Builds a response object containing the list of results passed in 
     * and some pagination metadata.
     * 
     * @param results 
     * 
     * @returns Promise<Object>
     */
    private async buildResponse(results: Utility[]|Version[]): Promise<Object> {
        let response = {
            'content': results,
            'page': this.page,
            'results_per_page': this.results_per_page,
            'total_results': this.total_records,
        };

        return response;
    }

    /**
     * Builds and returns an options object (to be passed into this.find()) based upon
     * the query parameter passed in.
     * 
     * @param entry 
     * 
     * @returns Object
     */
    private buildSortOptions(entry: string): Object {
        let options = undefined;
        
        const field_to_sort = entry.split(":")[0].toLowerCase();
        const sort_order = entry.split(":")[1].toUpperCase();
        
        options = {
            order: {
                [field_to_sort]: sort_order,
            },
        };
        
        return options;
    }
    
    /**
     * Builds and returns an options object (to be passed into this.find()) based upon
     * the query parameter passed in.
     * 
     * @param entry 
     * 
     * @returns Object
     */
    private buildFilterOptions(entry: string): Object {
        let options = undefined;

        const field_to_filter = entry.split(":")[0].toLowerCase();
        const filter_value = entry.split(":")[1];
        let needs_like = false;

        switch (field_to_filter) {
            case 'title':
            case 'description':
                needs_like = true
                break;
            default:
                break;
        }

        options = {
            where: {
                [field_to_filter]: needs_like ? ILike(`%${filter_value}%`) : filter_value,
            },
        };

        return options;
    }

    /**
     * Retrieves a particular Utility from the database by id.
     * 
     * @param id 
     * 
     * @returns Promise<Utility>
     */
    async getUtilityById(id: number): Promise<Utility> {
        const util = await this.repo.findOne(id)

        if (util) {
            return util;
        }

        throw new HttpException('No Utility Found by that ID', HttpStatus.NOT_FOUND)
    }

    /**
     * Retrieves any Version associated with the Utility id passed in. Returns
     * an object containing the list of results and pagination metadata.
     * 
     * @param id 
     * 
     * @returns Promise<Object>
     */
    async getVersionsByUtility(id: number): Promise<Object> {
        const results = await this.versionService.getVersionsByUtilityId(id);

        const paginated_results = this.paginate(results);

        return this.buildResponse(paginated_results);
    }

    /**
     * Creates a new Utility record in the database, then returns
     * the new record.
     * 
     * @param utility 
     * 
     * @returns Promise<Utility>
     */
    async create(utility: CreateUtilityDto): Promise<Utility> {
        const newUtil = this.repo.create(utility);
        await this.repo.save(newUtil);

        return newUtil;
    }

    /**
     * Saves a copy of the Utility with the id passed in to
     * the Versions table, increments the version number and
     * updates the record with the data passed in.
     * 
     * @param id 
     * @param util 
     * 
     * @returns Promise<Utility>
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
     * Deletes a Utility from the database.
     * 
     * @param id 
     */
    async delete(id: number) {
        const deletedUtil = await this.repo.delete(id);
        
        if (!deletedUtil.affected) {
            throw new HttpException('No Utility Found by that ID', HttpStatus.NOT_FOUND)
        }
    }
}
