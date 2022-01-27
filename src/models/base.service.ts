export class BaseService {
    protected results_per_page = 5;
    protected page = 1;
    protected total_records = 0;

    /**
     * Handles pagination for the list of records passed in
     * 
     * @param results 
     * 
     * @returns any[]
     */
     protected paginate(results: any[]): any[] {
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
    protected async buildResponse(results: any[]): Promise<Object> {
        let response = {
            'content': results,
            'page': this.page,
            'results_per_page': this.results_per_page,
            'total_results': this.total_records,
        };

        return response;
    }
}
