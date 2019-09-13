import * as winston from "winston";

import { Logger } from "../../log";
import DBUserSchema from "../schemas/DBUserSchema";
import { AccessLevel } from "../../user/AccessLevel";

export namespace UserMigration {
    const logger: winston.Logger = new Logger("GuildPropertyMigration").getLogger();
    const userModel = DBUserSchema.getModel();

    export const createModels = async (ids: string[]): Promise<void> => {
        let i = 0;
        for (const userId of ids) {
            const user = await DBUserSchema.getUserById(userId);
            if (!user) {
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
            } else {
                if (user.accessLevel) {
                    if (user.accessLevel < AccessLevel.DEVELOPER) {
                        user.setAccessLevel(AccessLevel.DEVELOPER);
                    }
                }

            }
        }
    };
}
