import { IUser } from "../user/IUser";

export class User implements IUser {
    public readonly id: string;
    public accessLevel: number;
    public currency: {
        DotmaCoin: number;
        BradCoin: number;
    };
    constructor(id: string, accessLevel: number) {
        this.id = id;
        this.accessLevel = accessLevel;
        this.currency = {
            DotmaCoin: 100,
            BradCoin: 0
        };
        this.title = "The Undefined";
    }
}
