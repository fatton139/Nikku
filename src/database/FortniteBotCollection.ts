import * as MongoDb from "mongodb";
import { core } from "core/NikkuCore";

export class FortniteBotCollection {
    /**
     * Main database object.
     */
    protected db: MongoDb.Db;

    /**
     * @classdesc Main data collection for the bot.
     */
    constructor() {
        this.db = core.getDbCore().getDb();
    }
}
