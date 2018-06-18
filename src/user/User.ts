import { IUser } from "../user/IUser";

export class User implements IUser {
    public readonly id: string;
    public accessLevel: number;
    public currency: {
        DotmaCoin: number;
        BradCoin: number;
    };
    public daily: {
        lastUpdate: {
            DotmaCoin: Date;
        }
    };
    public title;
    constructor(id: string, accessLevel: number) {
        this.id = id;
        this.accessLevel = accessLevel;
        this.currency = {
            DotmaCoin: 100,
            BradCoin: 0
        };
        const date = new Date();
        date.setDate(date.getDate() - 1);
        this.daily = {
            lastUpdate: {
                DotmaCoin: date
            }
        };
        this.title = "The Untitled";
    }
}
