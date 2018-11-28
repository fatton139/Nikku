import * as winston from "winston";
import Logger from "log/Logger";
import { prop, Typegoose, ModelType, InstanceType, instanceMethod, staticMethod, arrayProp } from "typegoose";
import * as Mongoose from "mongoose";

export default class DBGuildPropertySchema extends Typegoose {
    private static readonly logger: winston.Logger = new Logger(DBGuildPropertySchema.constructor.name).getLogger();

    @prop({required: true, unique: true})
    public id: string;

    @arrayProp({default: [], items: String})
    public targets: string[];

    @instanceMethod
    public async addTarget(this: InstanceType<any> & Mongoose.Document, target: string): Promise<void> {
        this.targets.push(target);
        try {
            return await this.save();
        } catch (err) {
            DBGuildPropertySchema.logger.error("Failed to save guild targets.");
            throw err;
        }
    }

    @instanceMethod
    public async removeTarget(this: InstanceType<any> & Mongoose.Document, target: string): Promise<void> {
        const index = this.targets.indexOf(target);
        if (index === -1) {
            DBGuildPropertySchema.logger.verbose("Target does not exist on current guild target list.");
            return Promise.reject();
        }
        this.targets.splice(index, 1);
        try {
            return await this.save();
        } catch (err) {
            DBGuildPropertySchema.logger.error("Remove target, failed to save document.");
            throw err;
        }
    }
}
