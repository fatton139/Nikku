import * as MongoDb from "mongodb";
import { fortniteBotCore as activeCore } from "../../fortniteBot";
import { DatabaseException } from "../exceptions/DatabaseException";

export class GlobalCollection {
    private localDb: any;
    private db: MongoDb.Db;
    private dbId: MongoDb.ObjectId;
    constructor(localDb: any) {
        this.localDb = localDb;
        this.db = activeCore.getDbCore().getDb();
        this.dbId = new MongoDb.ObjectId("5b253b8cb43a095ddc7ff9a7");
    }
    public addTarget(id: string, callback: (res: boolean) => void): void {
        this.db.collection("global").updateOne({_id: this.dbId},
            {$push: { targets: id }}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }
    public getTargets(callback: (res: any[]) => void): void {
        this.db.collection("global").find({}).toArray().then((res) => {
            console.log(res[0].targets);
            callback(res[0].targets);
        });
    }
    public removeTarget(id: string, callback: (res: boolean) => void): void {
        this.db.collection("global").updateOne({_id: this.dbId},
            {$pull: { targets: id }}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }
}
