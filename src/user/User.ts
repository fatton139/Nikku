import { IUser } from "../user/IUser";

export class User implements IUser {
    public readonly id: string;
    public accessLevel: number;
    public name: string;
    constructor(id: string, accessLevel: number, name: string) {
        this.id = id;
        this.accessLevel = accessLevel;
        this.name = name;
    }
}
