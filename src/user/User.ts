import { IUser } from "../user/IUser";

export class User implements IUser {
    public readonly id: string;
    public type: string;
    public accessLevel: number;
    constructor(id: string, type: string, accessLevel: number) {
        this.type = type;
        this.accessLevel = accessLevel;
    }
}
