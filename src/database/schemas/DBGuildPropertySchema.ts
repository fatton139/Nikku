import * as tg from "typegoose";
import * as Mongoose from "mongoose";

export default class DBGuildPropertySchema extends tg.Typegoose {
    @tg.prop({required: true, unique: true})
    public id: string;

    @tg.arrayProp({default: [], items: String})
    public targets: string[];

    @tg.instanceMethod
    public async addTarget(this: tg.InstanceType<any> & Mongoose.Document, target: string) {
        this.targets.push(target);
        await this.save();
    }
}
