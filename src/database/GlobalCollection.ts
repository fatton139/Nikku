import * as MongoDb from "mongodb";
import { fortniteBotCore as activeCore } from "../../fortniteBot";
import { DatabaseException } from "../exceptions/DatabaseException";
import { FortniteBotCollection } from "./FortniteBotCollection";
import { ICollection } from "./ICollection";

export class GlobalCollection extends FortniteBotCollection implements ICollection {
    /**
     * The local database for this collection.
     */
    private localDb: any;

    /**
     * The id of the collection.
     */
    private dbId: MongoDb.ObjectId;

    /**
     * @classdesc Collection of global values and objects.
     * @param localDb - The local database for this collection.
     */
    constructor(localDb: any) {
        super();
        this.localDb = localDb;
        this.dbId = new MongoDb.ObjectId("5b5adfbcfe69061b34ba342c");
    }

    /**
     * Sets up the required fields for operation.
     */
    public createSchema(): void {
        this.db.collection("global").insertOne({targets: []}, (err) => {
            if (err) {
                throw new DatabaseException(err);
            }
        });
        this.db.collection("global").insertOne({lastUpdate: new Date()}, (err) => {
            if (err) {
                throw new DatabaseException(err);
            }
        });
    }

    /**
     * Adds a object to an array currently in the DB.
     * @param id - The id to add.
     * @param callback - Callback true if update success.
     */
    public add(id: string, callback: (res: boolean) => void): void {
        this.db.collection("global").updateOne({_id: this.dbId},
            {$push: { targets: id }}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }

    /**
     * Gets the collection.
     * @param callback - Callback the results of the collection.
     */
    public get(callback: (res: any[]) => void): void {
        this.db.collection("global").find({}).toArray().then((res: any) => {
            callback(res);
        });
    }

    /**
     * Updates a specific field with an value
     * @param field - The field to update.
     * @param value - The new value.
     * @param callback - Callback true if updated successfully.
     */
    public update(field: string, value: any,
                  callback: (res: boolean) => void): void {
        const set = {};
        set[field] = value;
        this.db.collection("global").update({_id: this.dbId},
            {$set: set}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }

    /**
     * Removes a user from the target array.
     * @param id - The id of the user to remove.
     * @param callback - Callback true if removed successfully.
     */
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
