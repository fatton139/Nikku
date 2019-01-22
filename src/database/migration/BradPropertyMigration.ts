import * as winston from "winston";
import Logger from "log/Logger";
import DBBradPropertySchema from "database/schemas/DBBradPropertySchema";

export namespace BradPropertyMigration {
    const logger: winston.Logger = new Logger("BradPropertyMigration").getLogger();
    const bradModel = DBBradPropertySchema.getModel();

    export const DEFAULT_STARTING_WEIGHT = 200;

    export const createModels = async (): Promise<void> => {
        const model = new bradModel({
            weight: DEFAULT_STARTING_WEIGHT,
            contributors: [],
        });
        try {
            const doc = await model.save();
            logger.info("Setup Brad properties document.");
            Promise.resolve(doc);
        } catch (err) {
            logger.error("Failed to setup Brad properties document.");
            Promise.reject(err);
        }
    };
}
