// import * as Mongoose from "mongoose";
// import { prop, Typegoose, InstanceType } from "typegoose";

// /** Singleton schema for storing global properties. */
// export default class DBGlobalPropertySchema extends Typegoose {
//     @prop({default: new Date()})
//     // private startTime?: Date;

//     @prop({default: new Date()})
//     // private shopLastUpdate?: Date;

//     public static getModel(): Mongoose.Model<InstanceType<DBGlobalPropertySchema>> & DBGlobalPropertySchema
//             & typeof DBGlobalPropertySchema {
//         return new DBGlobalPropertySchema().getModelForClass(DBGlobalPropertySchema);
//     }
// }
