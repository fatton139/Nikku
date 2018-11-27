import * as winston from "winston";
import Logger from "log/Logger";
import { prop, Typegoose, ModelType, InstanceType, instanceMethod, staticMethod } from "typegoose";
import AccessLevel from "user/AccessLevel";

export default class DBUserSchema extends Typegoose {
    private static readonly logger: winston.Logger = new Logger(DBUserSchema.constructor.name).getLogger();
    @prop({required: true, unique: true})
    private id: string;

    @prop({default: AccessLevel.UNREGISTERED})
    private accessLevel?: AccessLevel;

    @prop({default: {dotmaCoin: 100, bradCoin: 0}})
    private currency?: {
        dotmaCoin: number,
        bradCoin: number,
    };

    @prop({default: new Date()})
    private daily?: {
        lastUpdate: Date,
    };

    @prop({default: {active: 0, all: ["The Untitled"]}})
    private title?: {
        active: number,
        all: string[];
    };

    @instanceMethod
    public getId(): string {
        return this.id;
    }

    @instanceMethod
    public setAccessLevel(level: AccessLevel): void {
        this.accessLevel = this.accessLevel;
    }

    @instanceMethod
    public getAccessLevel(): AccessLevel {
        return this.accessLevel ? this.accessLevel : AccessLevel.UNREGISTERED;
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
