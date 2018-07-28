import * as MongoDb from "mongodb";
import { MongoClient } from "mongodb";
import { FortniteBotDbConfig } from "../config/FortniteBotDbConfig";
import { DatabaseException } from "../exceptions/DatabaseException";
import { GlobalCollection } from "../database/GlobalCollection";
import { UserCollection } from "../database/UserCollection";

export class FortniteBotDbCore {
    /**
     * Collections which store other forms of data.
     */
    public collections: {
        global: GlobalCollection;
        user: UserCollection;
    };

    /**
     * Database configurations.
     */
    private readonly config: FortniteBotDbConfig;

    /**
     * Database object to interact with.
     */
    private database: MongoDb.MongoClient;
    private db: MongoDb.Db;

    /**
     * @classdesc Class for handling important database methods.
     * @param config - Initial database configurations.
     */
    constructor(config: FortniteBotDbConfig) {
        this.config = config;
        this.collections = {
            global: null,
            user: null
        };
    }

    /**
     * Attempts to connect to the host.
     * @param callback - callback when database has been connected.
     */
    public connectDb(callback: () => void): void {
        MongoClient.connect(this.config.url, (err, database) => {
            if (err) {
                throw new DatabaseException(err);
            }
            this.db = database.db("fortniteBotDb");
            this.database = database;
            this.db.collection("global").find().toArray().then((res) => {
                this.collections.global = new GlobalCollection(res);
            });
            this.db.collection("user").find().toArray().then((res) => {
                this.collections.user = new UserCollection(res);
            });
            callback(); // Todo async.parallel
        });
    }

    /**
     * Gets the current database.
     */
    public getDb(): MongoDb.Db {
        return this.db;
    }

    /**
     * Closes connection to the host of the db.
     */
    public closeDb(): void {
        this.database.close();
    }
}
