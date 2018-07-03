import * as Discord from "discord.js";
import { fortniteBotCore as activeCore } from "../../fortniteBot";

export class FortniteBotState {
    public handle: any;
    constructor(handle: object) {
        this.handle = handle;
    }
    public setHandle(handle: object): void {
        this.handle = handle;
    }
    public getHandle(): any {
        return this.handle;
    }
    public updateHandle(): any {
        return activeCore.getCoreState().getHandle();
    }
}
