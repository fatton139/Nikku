import { Message } from "discord.js";

import { FortniteBotState } from "./FortniteBotState";

export class CommandExecutionState extends FortniteBotState {
    /**
     * @classdesc State for when a command is being executed.
     * @param message - Discord message handler.
     */
    public constructor(message: Message) {
        super(message);
    }
}
