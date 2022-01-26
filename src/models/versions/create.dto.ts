import Utility from "../utility/utility.entity";

class CreateVersionDto {
    public title: string;
    public description: string;
    public version: number;
    public published: boolean;
    public created_at: Date;
    public utility: Utility;

    constructor(oldUtility: Utility) {
        this.title = oldUtility.title;
        this.description = oldUtility.description;
        this.version = oldUtility.verison;
        this.published = oldUtility.published;
    }
}

export default CreateVersionDto;
