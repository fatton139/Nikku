import * as winston from "winston";
import Logger from "log/Logger";
import DBGuildPropertySchema from "database/schemas/DBGuildPropertySchema";
import { GuildConfig } from "config/GuildBooleanConfig";

export namespace GuildPropertyMigration {
    const logger: winston.Logger = new Logger("GuildPropertyMigration").getLogger();
    const LocalPropertyModel = new DBGuildPropertySchema().getModelForClass(DBGuildPropertySchema);

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
        const keys = Object.keys(GuildConfig.BooleanConfig.Options).filter((key) => isNaN(Number(key)));
        for (const guild of await LocalPropertyModel.find({})) {
            for (const key of keys) {
                if (!(await guild.booleanConfigExists(key))) {
                    await guild.addBooleanConfig(key);
                }
            }
        }
    };
}
