import * as winston from "winston";
import Logger from "log/Logger";
import DBUserSchema from "database/schemas/DBUserSchema";
import { AccessLevel } from "user/AccessLevel";

export namespace UserMigration {
    const logger: winston.Logger = new Logger("GuildPropertyMigration").getLogger();
    const userModel = DBUserSchema.getModel();

    export const createModels = async (ids: string[]): Promise<void> => {
        let i = 0;
        for (const userId of ids) {
            const userExists = await userModel.findOne({id: userId});
            if (!userExists) {
                const newModel = new userModel({
                    id: userId,
                    accessLevel: AccessLevel.DEVELOPER,
                });
                try {
                    await newModel.save();
                    i++;
                    logger.info(`Dev user created ${i} of ${ids.length}.`);
                } catch (err) {
                    logger.error(`Failed to create user ${userId}:${err}.`);
                    throw err;
                }
            }
        }
    };
}
