import * as MongoDb from "mongodb";
import { DatabaseException } from "../exceptions/DatabaseException";
import { FortniteBotCollection } from "./FortniteBotCollection";
import { ICollection } from "./ICollection";
import { User } from "../user/User";

export class UserCollection extends FortniteBotCollection implements ICollection {
    /**
     * The local database for this collection.
     */
    private localDb: any;
    /**
     * @classdesc Collection of user objects.
     * @param localDb - The local database for this collection.
     */
    constructor(localDb: any) {
        super();
        this.localDb = localDb;
    }

    /**
     * Adds a user to the collection.
     * @param user - The user to add to the collection.
     * @param callback - Callback true if successfully added.
     */
    public add(user: User, callback: (res: boolean) => void): void {
        this.db.collection("user").insert(user, (err) => {
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
        this.db.collection("user").find({}).toArray().then((res: any) => {
            callback(res);
        });
    }

    /**
     * Retrieves the data of a user by their id.
     * @param id - The id of the user.
     * @param callback - Callback data of the user.
     */
    public getUser(id: string, callback: (user: User) => void): void {
        this.get((res: User[]) => {
            const index = res.findIndex((user: User) => user.id === id);
            if (index === -1) {
                callback(null);
                return;
            }
            callback(res[index]);
        });
    }

    /**
     * Updates a user by their id.
     * @param id - The id of the user to update.
     * @param user - The new entries for the user.
     * @param callback - true if successfully updated.
     */
    public updateUser(id: string, user: User,
                      callback: (res: boolean) => void) {
        // Todo
        return;
    }

    /**
     * Updates a specific field of a user.
     * @param userId - The id of the user to update.
     * @param field - The field to update.
     * @param value - The new value for the field.
     * @param callback - Callback true if successfully updated.
     */
    public update(userId: string, field: string, value: any,
                  callback: (res: boolean) => void): void {
        const set = {};
        set[field] = value;
        this.db.collection("user").update({id: userId},
            {$set: set}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }

    /**
     * Increments a number value associated with the user.
     * @param userId - The id of the user to update.
     * @param field - The field to update.
     * @param value - The new value for the field.
     * @param callback - Callback true if successfully updated.
     */
    public incrementCoin(userId: string, field: string, value: number,
                         callback: (res: boolean) => void): void {
        this.get((res: User[]) => {
            const index = res.findIndex((user: User) => user.id === userId);
            if (index === -1) {
                return;
            }
            const newVal = res[index].currency[field] + value;
            this.update(userId, "currency." + field, newVal, (c: boolean) => {
                callback(c);
            });
        });
    }

    /**
     * Removes a user from the collection.
     * @param userId - The user to remove.
     * @param callback - Callback true if successfully removed.
     */
    public removeUser(userId: string, callback: (res: boolean) => void): void {
        this.db.collection("user").deleteOne({id: userId}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }

    /**
     * Replaces a user.
     * @param user - The user to replace
     * @param callback - true if successfully replaced.
     */
    public replace(user: User, callback: (res: boolean) => void) {
        this.db.collection("user").update({id: user.id}, user, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }
}
