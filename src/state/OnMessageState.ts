import * as Discord from "discord.js";
import { CoreState } from "./CoreState";

export class OnMessageState extends CoreState<Discord.Message> {
    public constructor(messageHandle: Discord.Message) {
        super(messageHandle);
        this.handle = messageHandle;
    }
}
