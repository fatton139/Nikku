import * as winston from "winston";
import Logger from "log/Logger";
import DBUserSchema from "database/schemas/DBUserSchema";
import AccessLevel from "user/AccessLevel";

export default class UserMigrator {
    private readonly logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    private schema: DBUserSchema;
    public constructor(schema: DBUserSchema) {
        this.schema = schema;
    }
    public async createModels(ids: string[]): Promise<any> {
        let i = 0;
        for (const userId of ids) {
            const userModel = this.schema.getModelForClass(DBUserSchema);
            const userExists = await userModel.findOne({id: userId});
            if (!userExists) {
                const model = new userModel({
                    id: userId,
                    accessLevel: AccessLevel.DEVELOPER,
                });
                try {
                    const doc = await model.save();
                    i++;
                    this.logger.info(`Dev user created ${i} of ${ids.length}.`);
                    return doc;
                } catch (err) {
                    this.logger.error(`Failed to create user ${userId}:${err}.`);
                    throw err;
                }
            }
        }
    }
}
