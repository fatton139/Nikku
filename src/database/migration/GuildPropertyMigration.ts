import * as winston from "winston";
import { Logger } from "log";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";
import { GuildConfig } from "config/GuildConfig";

export namespace GuildPropertyMigration {
    const logger: winston.Logger = new Logger("GuildPropertyMigration").getLogger();
    const LocalPropertyModel = DBGuildPropertySchema.getModel();

    export const createModels = async (): Promise<void> => {
        const model = new LocalPropertyModel({
            targets: [],
            booleanConfig: {},
        });
        try {
            await model.save();
            logger.info("Setup guild properties document.");
        } catch (err) {
            logger.error("Failed to setup guild properties document.");
            throw err;
        }
    };

    export const verifyGuildConfig = async (): Promise<void> => {
        for (const guild of await LocalPropertyModel.find({})) {
            for (const key of GuildConfig.BooleanConfig.keys) {
                if (!(await guild.booleanConfigExists(key))) {
                    await guild.addBooleanConfig(key);
                }
            }
        }
    };
}
