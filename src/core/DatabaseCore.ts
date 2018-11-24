import * as MongoDb from "mongodb";
import * as Mongoose from "mongoose";
import * as winston from "winston";
import * as Discord from "discord.js";
import DBUserSchema from "database/schemas/DBUserSchema";
import DBGlobalPropertySchema from "database/schemas/DBGlobalPropertySchema";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";
import Logger from "log/Logger";
import UserMigrator from "database/migration/UserMigrator";
import GlobalPropertyMigrator from "database/migration/GlobalPropertyMigrator";
import GuildPropertyMigrator from "database/migration/GuildPropertyMigrator";
import NikkuCore from "./NikkuCore";

export default class DatabaseCore {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    private client: Discord.Client;
    private readonly URL: string;
    /**
     * Database connection.
     */
    private connection: Mongoose.Connection;

    private UserModel: Mongoose.Model<Mongoose.Document, {}>;
    private globalPropertyModel: Mongoose.Model<Mongoose.Document, {}>;
    private guildPropertyModel: Mongoose.Model<Mongoose.Document, {}>;

    private defaultUsers: string[];

    private core: NikkuCore;

    private ready: boolean;
    /**
     * @classdesc Class for handling important database methods.
     */
    public constructor(core: NikkuCore) {
        this.URL = core.getConfig().Database.URL;
        this.defaultUsers = core.getConfig().DefaultUser.IDS;
        this.client = core.getClient();
        this.core = core;
        this.ready = false;
        this.logger.debug("");
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
            this.generateModelsIfEmpty().then(() => {
                this.ready = true;
                this.logger.info("Database connected successfully.");
            });
        });
    }

    public async generateDevUserModel(): Promise<void> {
        const userSchema: DBUserSchema = new DBUserSchema();
        this.UserModel = userSchema.getModelForClass(DBUserSchema);
        const doc: Mongoose.Document[] = await this.UserModel.find({});
        if (doc.length === 0) {
            this.logger.warn(`Dev user models not detected. Creating ${this.defaultUsers.length} dev profiles.`);
            const migrator = new UserMigrator(userSchema);
            await migrator.createModels(this.defaultUsers);
        }
        Promise.resolve();
    }

    public async generateGlobalPropertyModel(): Promise<void> {
        const globalPropertySchema = new DBGlobalPropertySchema();
        this.globalPropertyModel = globalPropertySchema.getModelForClass(DBGlobalPropertySchema);
        const doc: Mongoose.Document[] = await this.globalPropertyModel.find({});
        if (doc.length === 0) {
            this.logger.warn("Global properties document has not been setup. Creating default profiles.");
            const migrator = new GlobalPropertyMigrator(globalPropertySchema);
            await migrator.createModels();
        }
        Promise.resolve();
    }

    public async generateGuildPropertyModel(): Promise<void> {
        const guildPropertySchema = new DBGuildPropertySchema();
        this.guildPropertyModel = guildPropertySchema.getModelForClass(DBGuildPropertySchema);
        const docs = await this.guildPropertyModel.find({}) as any as DBGuildPropertySchema[];
        for (const guild of this.client.guilds) {
            if (docs.findIndex((sGuild) => sGuild.id === guild[1].id) === -1) {
                const model = new this.guildPropertyModel({
                    id: guild[1].id,
                });
                this.logger.warn(`Unregistered guild detected. Creating server property document for ${guild[1].name}.""`);
                await model.save();
            }
        }
        Promise.resolve();
    }

    public async generateModelsIfEmpty(): Promise<void> {
        await Promise.all([
            this.generateDevUserModel(),
            this.generateGlobalPropertyModel(),
            this.generateGuildPropertyModel(),
        ]);
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
        this.ready = false;
    }

    public getUserModel(): Mongoose.Model<Mongoose.Document, {}> {
        return this.UserModel;
    }

    public getGlobalPropertyModel(): Mongoose.Model<Mongoose.Document, {}> {
        return this.globalPropertyModel;
    }

    public getGuildPropertyModel(): Mongoose.Model<Mongoose.Document, {}> {
        return this.guildPropertyModel;
    }

    public isReady(): boolean {
        return this.ready;
    }
}
