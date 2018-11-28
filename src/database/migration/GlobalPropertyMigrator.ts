import * as winston from "winston";
import * as Mongoose from "mongoose";
import Logger from "log/Logger";
import DBGlobalPropertySchema from "database/schemas/DBGlobalPropertySchema";

export default class GlobalPropertyMigrator {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    private schema: DBGlobalPropertySchema;
    public constructor(schema: DBGlobalPropertySchema) {
        this.schema = schema;
    }
    public async createModels(): Promise<any> {
        const dateModel = this.schema.getModelForClass(DBGlobalPropertySchema);
        const model = new dateModel({
            startTime: new Date(),
            shopLastUpdate: new Date(),
        });
        try {
            const doc = await model.save();
            this.logger.info("Setup global properties document.");
            Promise.resolve(doc);
        } catch (err) {
            this.logger.error("Failed to setup global properties document.");
            Promise.reject(err);
        }
    }
}
