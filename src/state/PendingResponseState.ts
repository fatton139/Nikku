import { Message } from "discord.js";
import { CommandExecutionState } from "./CommandExecutionState";

export class PendingResponseState extends CommandExecutionState {
    /**
     * @classdesc State for when a response is required.
     * @param message - Discord message handler.
     */
    public constructor(message: Message) {
        super(message);
    }
}
