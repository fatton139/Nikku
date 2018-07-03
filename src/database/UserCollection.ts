import * as MongoDb from "mongodb";
import { DatabaseException } from "../exceptions/DatabaseException";
import { FrotniteBotCollection } from "./FortniteBotCollection";
import { ICollection } from "./ICollection";
import { User } from "../user/User";

export class UserCollection extends FrotniteBotCollection implements ICollection {
    private localDb: any;
    constructor(localDb: any) {
        super();
        this.localDb = localDb;
    }
    public add(user: User, callback: (res: boolean) => void): void {
        this.db.collection("user").insert(user, (err) => {
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
    public updateUser(id: string, user: User,
                      callback: (res: boolean) => void) {

        return;
    }
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
    public removeUser(userId: string, callback: (res: boolean) => void): void {
        this.db.collection("user").deleteOne({id: userId}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }
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
