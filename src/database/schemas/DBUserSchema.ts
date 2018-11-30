import * as winston from "winston";
import * as Mongoose from "mongoose";
import Logger from "log/Logger";
import { prop, Typegoose, ModelType, InstanceType, instanceMethod, staticMethod, arrayProp } from "typegoose";
import AccessLevel from "user/AccessLevel";
import CoinType from "user/CoinType";
import { Skill } from "user/Skill";

export default class DBUserSchema extends Typegoose {
    public static readonly logger: winston.Logger = new Logger(DBUserSchema.constructor.name).getLogger();
    @prop({required: true, unique: true})
    public id: string;

    @prop({default: AccessLevel.UNREGISTERED})
    public accessLevel?: AccessLevel;

    @prop({default: {dotmaCoin: 100, bradCoin: 0}})
    public wallet?: {
        dotmaCoin: number,
        bradCoin: number,
    };

    @prop({default: {thievexp: 0, thievelevel: 1}})
    public skills?: {
        thievexp: number,
        thievelevel: number,
    };

    @prop({default: {lastUpdate: new Date((new Date()).setDate(new Date().getDate() - 1))}})
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
    public async setAccessLevel(this: InstanceType<any>, level: AccessLevel): Promise<void> {
        this.accessLevel = level;
        try {
            return await this.save();
        } catch (err) {
            DBUserSchema.logger.error("Failed to save user access level.");
            throw err;
        }
    }

    @instanceMethod
    public async setDaily(this: InstanceType<any> & Mongoose.Document): Promise<void> {
        this.daily.lastUpdate = new Date();
        try {
            await this.markModified("daily");
            return await this.save();
        } catch (err) {
            DBUserSchema.logger.error("Failed to save user daily.");
            throw err;
        }
    }

    @instanceMethod
    public async addCurrency(this: InstanceType<any> & Mongoose.Document, type: CoinType, amount: number): Promise<void> {
        this.wallet[type] += amount;
        try {
            await this.markModified("wallet");
            return await this.save();
        } catch (err) {
            DBUserSchema.logger.error("Failed to save user currency.");
            throw err;
        }
    }

    @instanceMethod
    public async addXp(this: InstanceType<any> & Mongoose.Document, amount: number): Promise<void> {
        this.skills.thievexp += amount;
        try {
            await this.markModified("skills");
            const x = new Skill("Thieving").getLevelAtExperience(this.skills.thievexp);
            this.skills.thievelevel = x;
            return await this.save();
        } catch (err) {
            DBUserSchema.logger.error("Failed to update experience.");
            throw err;
        }
    }

    @instanceMethod
    public async removeCurrency(this: InstanceType<any> & Mongoose.Document, coinType: CoinType, amount: number): Promise<void> {
        return this.addCurrency(coinType, -1 * amount);
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
