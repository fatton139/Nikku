import * as winston from "winston";
import Logger from "log/Logger";
import { prop, Typegoose, ModelType, InstanceType, instanceMethod, staticMethod } from "typegoose";
import AccessLevel from "user/AccessLevel";

export default class DBUserSchema extends Typegoose {
    public static readonly logger: winston.Logger = new Logger(DBUserSchema.constructor.name).getLogger();
    @prop({required: true, unique: true})
    public id: string;

    @prop({default: AccessLevel.UNREGISTERED})
    public accessLevel?: AccessLevel;

    @prop({default: {dotmaCoin: 100, bradCoin: 0}})
    public currency?: {
        dotmaCoin: number,
        bradCoin: number,
    };

    @prop({default: new Date()})
    public daily?: {
        lastUpdate: Date,
    };

    @prop({default: {active: 0, all: ["The Untitled"]}})
    public title?: {
        active: number,
        all: string[];
    };

    @prop({default: new Date()})
    public dateRegistered: Date;

    @instanceMethod
    public setAccessLevel(level: AccessLevel): void {
        this.accessLevel = level;
    }

    @staticMethod
    public static async createNewUser(this: ModelType<DBUserSchema> & typeof DBUserSchema, id: string): Promise<any> {
        const userModel = new DBUserSchema().getModelForClass(DBUserSchema);
        const model = new userModel({
            id,
            accessLevel: AccessLevel.REGISTERED,
        });
        try {
            const docs = await model.save();
            DBUserSchema.logger.info("New user registered.");
            Promise.resolve(docs);
        } catch (err) {
            DBUserSchema.logger.info(`Failed to register user:${err}`);
            Promise.reject(err);
        }
    }
}
