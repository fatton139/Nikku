import * as MongoDb from "mongodb";
import { fortniteBotCore as activeCore } from "../../fortniteBot";

export class FrotniteBotCollection {
    protected db: MongoDb.Db;
    constructor() {
        this.db = activeCore.getDbCore().getDb();
    }
}
