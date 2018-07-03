import { Message } from "discord.js";

import { FortniteBotState } from "./FortniteBotState";

export class CommandExecutionState extends FortniteBotState {
    public constructor(message: Message) {
        super(message);
    }
}
