import * as winston from "winston";
import Logger from "log/Logger";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";

export default class GuildPropertyMigrator {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    private schema: DBGuildPropertySchema;
    public constructor(schema: DBGuildPropertySchema) {
        this.schema = schema;
    }
    public async createModels(): Promise<any> {
        const LocalPropertyModel = this.schema.getModelForClass(DBGuildPropertySchema);
        const model = new LocalPropertyModel({
            targets: [],
        });
        try {
            const docs = await model.save();
            this.logger.info("Setup guild properties document.");
            Promise.resolve(docs);
        } catch (err) {
            this.logger.error("Failed to setup guild properties document.");
            Promise.reject(err);
        }
    }
}
