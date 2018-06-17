import * as MongoDb from "mongodb";

export interface ICollection {
    add(id: string, callback: (res: boolean) => void): void;
    get(callback: (res: any[]) => void): void;
}
