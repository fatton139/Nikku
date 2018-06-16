import * as MongoDb from "mongodb";
import { MongoClient } from "mongodb";
import { FortniteBotDbConfig } from "../config/FortniteBotDbConfig";
import { DatabaseException } from "../exceptions/DatabaseException";
import { GlobalCollection } from "../database/GlobalCollection";

export class FortniteBotDbCore {
    public GlobalCollection: GlobalCollection;
    private readonly config: FortniteBotDbConfig;
    private database: MongoDb.MongoClient;
    private db: MongoDb.Db;
    constructor(config: FortniteBotDbConfig) {
        this.config = config;
    }
    public connectDb(callback: () => void): void {
        MongoClient.connect(this.config.url, (err, database) => {
            if (err) {
                throw new DatabaseException(err);
            }
            this.db = database.db("fortniteBotDb");
            this.database = database;
            this.db.collection("global").find().toArray().then((res) => {
                this.GlobalCollection = new GlobalCollection(res);
            });
            callback();
        });
    }
    public getDb(): MongoDb.Db {
        return this.db;
    }

    public closeDb(): void {
        this.database.close();
    }
}
