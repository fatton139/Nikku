import { Message } from "discord.js";

import { CommandExecutionState } from "./CommandExecutionState";

export class PendingResponseState extends CommandExecutionState {
    public constructor(message: Message) {
        super(message);
    }
    public resolve() {
        console.log("resolving");
        return;
    }
}
