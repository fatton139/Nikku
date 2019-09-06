import * as Discord from "discord.js";
import { CoreState } from "state";
import { AbstractCommand } from "command";
import { NikkuException } from "./";

export class CommandException extends NikkuException {

    private state: CoreState<Discord.Message>;

    /**
     * @classdesc Exception thrown when a command is executed without the appropriate access level.
     * @param message - Message associated with the error.
     */
    constructor(state: CoreState<Discord.Message>, command: AbstractCommand) {
        super(`Exception occurred during execution of "${command.getCommandString()}"`);
        this.state = state;
    }

    protected toExecutionUser(message: string): void {
        this.state.getHandle().reply(message);
    }
}
