import * as MongoDb from "mongodb";
import * as Mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { DatabaseException } from "../exceptions/DatabaseException";
import { GlobalCollection } from "../database/GlobalCollection";
import { UserCollection } from "../database/UserCollection";
import { Config } from "config/Config";
import { DatabaseSchema } from "database/schemas/UserSchema";

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
    private connection: Mongoose.Connection;

    private UserModel: Mongoose.Model<Mongoose.Document, {}>;
    /**
     * @classdesc Class for handling important database methods.
     */
    public constructor(url: string) {
        this.URL = url;
    }

    /**
     * Attempts to connect to the host.
     */
    public async connectDb(): Promise<void> {
        Mongoose.connect(this.URL, { useNewUrlParser: true });
        this.connection = Mongoose.connection;
        this.connection.on("error", () => {
            throw new Error("Connection Error");
        });
        this.connection.once("open", () => {
            this.UserModel = new DatabaseSchema.User().getModelForClass(DatabaseSchema.User);
            this.UserModel.find({}).then((doc) => {
                console.log(doc);
                if (doc.length === 0) {
                    return;
                }
            });
        }).catch((err) => {
            throw new DatabaseException(err);
        });
    }

    /**
     * Gets the current database.
     */
    public getDb(): MongoDb.Db {
        return this.connection.db;
    }

    /**
     * Closes connection to the host of the db.
     */
    public closeConnection(): void {
        this.connection.close();
    }
}
