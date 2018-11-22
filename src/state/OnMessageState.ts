import * as Discord from "discord.js";
import CoreState from "./CoreState";
import NikkuCore from "core/NikkuCore";

export default class OnMessageState extends CoreState {
    public constructor(core: NikkuCore, messageHandle: Discord.Message) {
        super(core);
        this.messageHandle = messageHandle;
    }

    public getMessageHandle(): Discord.Message {
        return this.messageHandle;
    }
}
