import { prop, Typegoose, ModelType, InstanceType } from "typegoose";
import { Schema } from "mongoose";
import { AccessLevel } from "user/AccessLevel";

export namespace DatabaseSchema {
    export class User extends Typegoose {
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
    }
}
