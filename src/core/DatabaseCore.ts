import * as MongoDb from "mongodb";
import * as Mongoose from "mongoose";
import { DBUserSchema } from "database/schemas/DBUserSchema";
import { DBDateTracker } from "database/schemas/DBDateTracker";
import { Logger } from "logger/Logger";
import winston = require("winston");
import { UserMigrator } from "database/mirgration/UserMigrator";

export class DatabaseCore {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    private readonly URL: string;
    /**
     * Database connection.
     */
    private connection: Mongoose.Connection;

    private UserModel: Mongoose.Model<Mongoose.Document, {}>;
    private DateTrackerModel: Mongoose.Model<Mongoose.Document, {}>;

    private defaultUsers: string[];
    /**
     * @classdesc Class for handling important database methods.
     */
    public constructor(url: string, defaultUsers: string[]) {
        this.URL = url;
        this.defaultUsers = defaultUsers;
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
            const userSchema: DBUserSchema = new DBUserSchema();
            this.UserModel = userSchema.getModelForClass(DBUserSchema);
            this.UserModel.find({}).then((doc) => {
                if (doc.length === 0) {
                    this.logger.warn("User model has not been setup. Creating default profiles...");
                    const migrator = new UserMigrator(userSchema);
                    migrator.createModels(this.defaultUsers);
                }
            });
            this.DateTrackerModel = new DBDateTracker().getModelForClass(DBDateTracker);
            this.DateTrackerModel.find({}).then((doc) => {
                if (doc.length === 0) {
                    this.logger.warn("Date tracker model has not been setup. Creating default profiles...");
                }
            });
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
