import { prop, Typegoose } from "typegoose";

/** Singleton schema for storing global properties. */
export default class DBGlobalPropertySchema extends Typegoose {
    @prop({default: new Date()})
    private startTime: Date;

    @prop({default: new Date()})
    private shopLastUpdate: Date;
}
