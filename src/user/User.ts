import { IUser } from "../user/IUser";

export class User implements IUser {
    /**
     * The id of the user.
     */
    public readonly id: string;

    /**
     * The access level of the user.
     */
    public accessLevel: number;

    /**
     * The user's wallet.
     */
    public currency: {
        DotmaCoin: number;
        BradCoin: number;
    };

    /**
     * The user's daily actions.
     */
    public daily: {
        lastUpdate: {
            DotmaCoin: Date;
        }
    };

    /**
     * The user's current title and titles which they have purchased.
     */
    public title: {
        active: string
        list: string[]
    };

    /**
     * Equipment of the user.
     */
    public equipment;

    /**
     * Skills of the user.
     */
    public skills;

    /**
     * @classdesc Base user class.
     * @param id - The id of the user.
     * @param accessLevel - The access level of the user.
     */
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
        this.title = {
            active: "The Untitled",
            list: ["The Untitled"]
        };
    }
}
