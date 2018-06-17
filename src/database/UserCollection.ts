import * as MongoDb from "mongodb";
import { DatabaseException } from "../exceptions/DatabaseException";
import { FrotniteBotCollection } from "./FortniteBotCollection";
import { ICollection } from "./ICollection";
import { User } from "../user/User";

export class UserCollection extends FrotniteBotCollection implements ICollection {
    private localDb: any;
    private dbId: MongoDb.ObjectId;
    constructor(localDb: any) {
        super();
        this.localDb = localDb;
        this.dbId = new MongoDb.ObjectId("5b2649da3627be241cb38b03");
    }
    public add(user: User, callback: (res: boolean) => void): void {
        this.db.collection("user").updateOne({_id: this.dbId},
            {$push: { users: user }}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }
    public get(callback: (res: any[]) => void): void {
        this.db.collection("user").find({}).toArray().then((res: any) => {
            callback(res);
        });
    }
}
