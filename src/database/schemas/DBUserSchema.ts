import { prop, Typegoose, ModelType, InstanceType, instanceMethod } from "typegoose";
import AccessLevel from "user/AccessLevel";

export default class DBUserSchema extends Typegoose {
    @prop({required: true, unique: true})
    private id: string;

    @prop({default: AccessLevel.UNREGISTERED})
    private accessLevel?: AccessLevel;

    @prop()
    private currency?: {};

    @prop()
    private daily?: {};

    @prop()
    private title?: {};

    @instanceMethod
    public setAccessLevel(level: AccessLevel) {
        this.accessLevel = this.accessLevel;
    }

    @instanceMethod
    public getAccessLevel(): AccessLevel {
        return this.accessLevel ? this.accessLevel : AccessLevel.UNREGISTERED;
    }
}
