import * as MongoDb from "mongodb";
import { MongoClient } from "mongodb";
import { DatabaseException } from "../exceptions/DatabaseException";
import { GlobalCollection } from "../database/GlobalCollection";
import { UserCollection } from "../database/UserCollection";
import { Config } from "config/Config";

export class DatabaseCore {
    /**
     * Collections which store other forms of data.
     */
    public collections: {
        global: GlobalCollection;
        user: UserCollection;
    };

    private readonly URL: string;
    /**
     * Database object to interact with.
     */
    private database: MongoDb.MongoClient;
    private db: MongoDb.Db;

    /**
     * @classdesc Class for handling important database methods.
     */
    public constructor(url: string) {
        this.URL = url;
    }

    /**
     * Attempts to connect to the host.
     * @param callback - callback when database has been connected.
     */
    public async connectDb(): Promise<void> {
        MongoClient.connect(this.URL).then((database) => {
            this.db = database.db("fortniteBotDb");
            this.database = database;
            this.db.collection("global").find().toArray().then((res) => {
                this.collections.global = new GlobalCollection(res);
            });
            this.db.collection("user").find().toArray().then((res) => {
                this.collections.user = new UserCollection(res);
            });
        }).catch((err) => {
            throw new DatabaseException(err);
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
