import * as MongoDb from "mongodb";
import * as Mongoose from "mongoose";
import * as winston from "winston";
import { DBUserSchema } from "database/schemas/DBUserSchema";
import { DBDateTracker } from "database/schemas/DBDateTracker";
import { Logger } from "logger/Logger";
import { UserMigrator } from "database/migration/UserMigrator";
import { DateMigrator } from "database/migration/DateMigrator";

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
        this.connection.on("error", (err) => {
            this.logger.error("Error connecting to DB:" + err + ".");
            throw new Error("Connection Error");
        });
        this.connection.once("open", () => {
            this.logger.info("Database connected successfully.");
            this.generateModelsIfEmpty();
        });
    }

    private generateModelsIfEmpty(): void {
        const userSchema: DBUserSchema = new DBUserSchema();
        this.UserModel = userSchema.getModelForClass(DBUserSchema);
        this.UserModel.find({}).then((doc) => {
            if (doc.length === 0) {
                this.logger.warn("Dev user models has not been setup. Creating default profiles.");
                const migrator = new UserMigrator(userSchema);
                migrator.createModels(this.defaultUsers);
            }
        });
        const dateTrackerSchema = new DBDateTracker();
        this.DateTrackerModel = dateTrackerSchema.getModelForClass(DBDateTracker);
        this.DateTrackerModel.find({}).then((doc) => {
            if (doc.length === 0) {
                this.logger.warn("Dates and times model has not been setup. Creating default profiles.");
                const migrator = new DateMigrator(dateTrackerSchema);
                migrator.createModels();
            }
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
        this.logger.warn("Connection to DB closed.");
        this.connection.close();
    }

    public getUserModel(): Mongoose.Model<Mongoose.Document, {}> {
        return this.UserModel;
    }

    public getDateTrackerModel(): Mongoose.Model<Mongoose.Document, {}> {
        return this.DateTrackerModel;
    }
}
