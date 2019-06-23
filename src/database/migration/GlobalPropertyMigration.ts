import * as winston from "winston";
import { Logger } from "log";
import DBGlobalPropertySchema from "database/schemas/DBGlobalPropertySchema";

export namespace GlobalPropertyMigration {
    const logger: winston.Logger = new Logger("GlobalPropertyMigration").getLogger();
    const globalPropertyModel = DBGlobalPropertySchema.getModel();

    export const createModels = async (): Promise<void> => {
        const model = new globalPropertyModel({
            startTime: new Date(),
            shopLastUpdate: new Date(),
        });
        try {
            await model.save();
            logger.info("Setup global properties document.");
        } catch (err) {
            logger.error("Failed to setup global properties document.");
            throw err;
        }
    };
}
