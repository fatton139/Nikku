import * as winston from "winston";
import * as Mongoose from "mongoose";
import Logger from "log/Logger";
import { prop, Typegoose, ModelType, InstanceType, instanceMethod, staticMethod, arrayProp } from "typegoose";
import { AccessLevel } from "user/AccessLevel";
import { CoinType } from "user/CoinType";
import Skill from "user/skill/Skill";
import SkillType from "user/skill/SkillType";
import { DatabaseException } from "exception/DatabaseException";

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

    // @ts-ignore
    @prop({enum: SkillType, default: {THIEVING: 0}})
    public skillsExperienceMap: {
        THIEVING: number,
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
        this.daily.lastUpdate = new Date().setHours(0, 0, 0, 0);
        try {
            await this.markModified("daily");
            return await this.save();
        } catch (err) {
            DBUserSchema.logger.error("Failed to save user daily.");
            throw err;
        }
    }

    @instanceMethod
    public async addSkillExperience(this: InstanceType<any> & Mongoose.Document, type: SkillType, amount: number): Promise<void> {
        try {
            this.skillsExperienceMap[SkillType[type.toString()]] += amount;
            await this.markModified("skillsExperienceMap");
            return await this.save();
        } catch (err) {
            DBUserSchema.logger.error("Failed to update user experience.");
            throw err;
        }
    }

    @instanceMethod
    public async getSkillExperience(this: InstanceType<any> & Mongoose.Document, type: SkillType): Promise<number> {
        try {
            return this.skillsExperienceMap[SkillType[type.toString()]];
        } catch (err) {
            DBUserSchema.logger.error("Failed to retrieve user experience.");
            throw err;
        }
    }

    @instanceMethod
    public async getSkillLevel(this: InstanceType<any> & Mongoose.Document, type: SkillType): Promise<number> {
        try {
            return Skill.getLevelAtExperience(await this.getSkillExperience(type));
        } catch (err) {
            DBUserSchema.logger.error("Failed to retrieve user level.");
            throw err;
        }
    }

    @instanceMethod
    public async addCurrency(this: InstanceType<any> & Mongoose.Document, type: CoinType, amount: number): Promise<void> {
        if (this.wallet[type] + amount > Number.MAX_SAFE_INTEGER) {
            throw new DatabaseException("Addition of currency will cause value to be greater than MAX_SAFE_INTEGER");
        }
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
    public async removeCurrency(this: InstanceType<any> & Mongoose.Document, type: CoinType, amount: number): Promise<void> {
        if (amount <= 0) {
            throw new DatabaseException("Amount should be positive.");
        }
        if (this.wallet[type] - amount < 0) {
            throw new DatabaseException("Removal of currency will cause value to go below zero.");
        }
        return this.addCurrency(type, -1 * amount);
    }

    public static async createNewUser(id: string): Promise<void> {
        const userModel = this.getModel();
        const model = new userModel({
            id,
            accessLevel: AccessLevel.REGISTERED,
        });
        try {
            await model.save();
            DBUserSchema.logger.info("New user registered.");
        } catch (err) {
            DBUserSchema.logger.info(`Failed to register user:${err}`);
        }
    }

    public static async getUserById(id: string): Promise<DBUserSchema> {
        return await (this.getModel().findOne({id}));
    }

    public static async getAllUser(): Promise<DBUserSchema[]> {
        return await (this.getModel().find({}));
    }

    public static getModel(): Mongoose.Model<InstanceType<DBUserSchema>> & DBUserSchema & typeof DBUserSchema {
        return new DBUserSchema().getModelForClass(DBUserSchema);
    }
}
