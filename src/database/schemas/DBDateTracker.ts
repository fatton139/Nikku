import { prop, Typegoose, ModelType, InstanceType } from "typegoose";

export default class DBDateTracker extends Typegoose {
    @prop({default: new Date()})
    private startTime: Date;

    @prop({default: new Date()})
    private shopLastUpdate: Date;
}
