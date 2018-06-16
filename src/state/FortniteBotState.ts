import * as Discord from "discord.js";

export class FortniteBotState {
    private handle: object;
    constructor(handle: object) {
        this.handle = handle;
    }
    public setHandle(handle: object): void {
        this.handle = handle;
    }
    public getHandle(): object {
        return this.handle;
    }
}
