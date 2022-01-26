import { Entity, ManyToOne } from "typeorm";
import Utility from "../utility/utility.entity";

@Entity('version')
class Version extends Utility {
    @ManyToOne(() => Utility, utility_ => utility_.id)
    utility_: Utility;
}

export default Version;
