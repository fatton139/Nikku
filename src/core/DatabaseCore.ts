import * as MongoDb from "mongodb";
import * as Mongoose from "mongoose";
import * as winston from "winston";

import { Logger } from "../log";
// import { AccessLevel } from "../user";

import { NikkuCore } from "./NikkuCore";

// Will be removed soon.
// import { UserMigration } from "../database/migration/UserMigration";
// import { GlobalPropertyMigration } from "../database/migration/GlobalPropertyMigration";
// import { GuildPropertyMigration } from "../database/migration/GuildPropertyMigration";
// import { BradPropertyMigration } from "../database/migration/BradPropertyMigration";
// import DBUserSchema from "../database/schemas/DBUserSchema";
// import DBGlobalPropertySchema from "../database/schemas/DBGlobalPropertySchema";
// import DBBradPropertySchema from "../database/schemas/DBBradPropertySchema";

export class DatabaseCore {
    public readonly logger: winston.Logger = Logger.getLogger(DatabaseCore);

    private readonly URI?: string;

    /**
     * Database connection.
     */
    private static connection: Mongoose.Connection;

    private defaultUsers?: string[];

    private ready: boolean;

    // private core: NikkuCore;

    /**
     * @classdesc Class for handling important database methods.
     */
    public constructor(core: NikkuCore) {
        this.logger.debug("Database Core initialized.");
        // this.core = core;
        this.URI = core.getConfig().getEnvironmentVariables().databaseOptions.URI;
        this.defaultUsers = core.getConfig().getEnvironmentVariables().discordOptions.DEVELOPER_IDS;
        this.ready = false;
    }

    public static setConnection(connection: Mongoose.Connection): void {
        this.connection = connection;
    }

    public static getConnection(): Mongoose.Connection {
        return this.connection;
    }

    /**
     * Attempts to connect to the host.
     */
    public async connectDb(): Promise<{}> {
        return new Promise((resolve, reject) => {
            if (this.URI) {
                Mongoose.connect(this.URI, { useNewUrlParser: true });
            }
            DatabaseCore.setConnection(Mongoose.connection);
            const connection = DatabaseCore.getConnection();
            connection.on("error", (err) => {
                this.logger.error(`Error connecting to DB: ${err}.`);
                reject(err);
            });
            connection.once("open", async () => {
                await this.generateModelsIfEmpty();
                this.ready = true;
                this.logger.info("Database connected successfully.");
                // const doc = await DBBradPropertySchema.getBrad();
                // if (doc && doc.weight) {
                //     this.core.setActivity(`Brad's Weight: ${doc.weight.toFixed(4)}kg`);
                // } else {
                //     this.core.setActivity(`Brad's Weight: unknown`);
                // }
                resolve();
            });
        });
    }

    public async generateDevUserModel(): Promise<void> {
        if (!this.defaultUsers) {
            return;
        }
        // const userModel = DBUserSchema.getModel();
        // const doc: Mongoose.Document[] = await userModel.find({ accessLevel: AccessLevel.DEVELOPER });
        if (this.defaultUsers) {
            // if (doc.length !== this.defaultUsers.length) {
            //     this.logger.warn(
            //         `Dev user models do not match. Creating ${this.defaultUsers.length - doc.length} dev profile(s).`,
            //         );
            //     await UserMigration.createModels(this.defaultUsers);
            // }
        }
    }

    public async generateGlobalPropertyModel(): Promise<void> {
        // const globalPropertyModel = DBGlobalPropertySchema.getModel();
        // const doc: Mongoose.Document[] = await globalPropertyModel.find({});
        // if (doc.length === 0) {
        //     this.logger.warn("Global properties document has not been setup. Creating default profiles.");
        //     await GlobalPropertyMigration.createModels();
        // }
    }

    public async generateGuildPropertyModel(): Promise<void> {
        // await GuildPropertyMigration.verifyGuildConfig();
    }

    public async generateBradPropertyModel(): Promise<void> {
        // if (!(await DBBradPropertySchema.getBrad())) {
        //     this.logger.warn("Brad properties document has not been setup. Creating default profiles.");
        //     await BradPropertyMigration.createModels();
        // }
    }

    public async generateModelsIfEmpty(): Promise<void> {
        await Promise.all([
            this.generateDevUserModel(),
            this.generateGlobalPropertyModel(),
            this.generateGuildPropertyModel(),
            this.generateBradPropertyModel(),
        ]);
    }

    /**
     * Gets the current database.
     */
    public static getDb(): MongoDb.Db {
        return this.connection.db;
    }

    /**
     * Closes connection to the host of the db.
     */
    public closeConnection(): void {
        this.logger.warn("Connection to DB closed.");
        DatabaseCore.getConnection().close();
        this.ready = false;
    }

    public isReady(): boolean {
        return this.ready;
    }
}
