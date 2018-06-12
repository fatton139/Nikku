import { Message } from "discord.js";

import { FortniteBotState } from "./FortniteBotState";

export class CommandExecutionState extends FortniteBotState {
    public messageHandle: Message;
    public constructor(message: Message) {
        super(message);
        this.messageHandle = message;
    }
}
