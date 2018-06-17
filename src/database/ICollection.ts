import * as MongoDb from "mongodb";

export interface ICollection {
    add(obj: any, callback: (res: boolean) => void): void;
    get(callback: (res: any[]) => void): void;
}
