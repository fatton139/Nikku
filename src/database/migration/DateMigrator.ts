import * as winston from "winston";
import Logger from "log/Logger";
import DBDateTracker from "database/schemas/DBDateTracker";

export default class DateMigrator {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    private schema: DBDateTracker;
    public constructor(schema: DBDateTracker) {
        this.schema = schema;
    }
    public createModels(): void {
        const dateModel = this.schema.getModelForClass(DBDateTracker);
        const model = new dateModel({
            startTime: new Date(),
            shopLastUpdate: new Date(),
        });
        model.save().then((obj) => {
            this.logger.info("DB Dates/Time setup.");
        }).catch((err) => {
            this.logger.error("Failed DB Dates/Time setup.");
        });
    }
}
