import { Message } from "discord.js";

import { CoreState } from "state/CoreState";

export class CommandExecutionState extends CoreState {
    /**
     * @classdesc State for when a command is being executed.
     * @param message - Discord message handler.
     */
    public constructor(message: Message) {
        super(message);
    }
}
