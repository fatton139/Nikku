import * as Mongoose from "mongoose";
import * as winston from "winston";
import { Migrator } from "./Migrator";
import { Logger } from "logger/Logger";
import { DBUserSchema } from "database/schemas/DBUserSchema";
import { AccessLevel } from "user/AccessLevel";

export class UserMigrator {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    private schema: DBUserSchema;
    public constructor(schema: DBUserSchema) {
        this.schema = schema;
    }
    public createModels(ids: string[]): void {
        let i = 0;
        for (const userId of ids) {
            const userModel = this.schema.getModelForClass(DBUserSchema);
            const model = new userModel({
                id: userId,
                accessLevel: AccessLevel.DEVELOPER,
            });
            model.save().then((user) => {
                i++;
                this.logger.info("Dev user saved " + i + " of " + ids.length);
            }).catch((err) => {
                this.logger.error("Failed to save user " + userId + ":" + err);
            });
        }
    }
}
