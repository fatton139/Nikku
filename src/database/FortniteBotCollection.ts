import * as MongoDb from "mongodb";
import { fortniteBotCore as activeCore } from "../../fortniteBot";

export class FortniteBotCollection {
    /**
     * Main database object.
     */
    protected db: MongoDb.Db;

    /**
     * @classdesc Main data collection for the bot.
     */
    constructor() {
        this.db = activeCore.getDbCore().getDb();
    }
}
