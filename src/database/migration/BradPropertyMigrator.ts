import * as winston from "winston";
import Logger from "log/Logger";
import DBBradPropertySchema from "database/schemas/DBBradPropertySchema";

export default class BradPropertyMigrator {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    private schema: DBBradPropertySchema;
    private readonly DEFAULT_STARTING_WEIGHT = 200;
    public constructor(schema: DBBradPropertySchema) {
        this.schema = schema;
    }
    public async createModels(): Promise<any> {
        const bradModel = this.schema.getModelForClass(DBBradPropertySchema);
        const model = new bradModel({
            weight: this.DEFAULT_STARTING_WEIGHT,
            contributors: [],
        });
        try {
            const doc = await model.save();
            this.logger.info("Setup Brad properties document.");
            Promise.resolve(doc);
        } catch (err) {
            this.logger.error("Failed to setup Brad properties document.");
            Promise.reject(err);
        }
    }
}
