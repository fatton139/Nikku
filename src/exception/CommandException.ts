import * as Discord from "discord.js";
import { NikkuException } from "exception";
import CoreState from "state/CoreState";
import Command from "command/AbstractCommand";

export class CommandException extends NikkuException {

    private state: CoreState<Discord.Message>;
    private command: Command;

    /**
     * @classdesc Exception thrown when a command is executed without the appropriate access level.
     * @param message - Message associated with the error.
     */
    constructor(state: CoreState<Discord.Message>, command: Command) {
        super(`Exception occurred during execution of "${command.getCommandString()}"`);
        this.state = state;
        this.command = command;
    }

    protected toExecutionUser(message: string): void {
        this.state.getHandle().reply(message);
    }
}
