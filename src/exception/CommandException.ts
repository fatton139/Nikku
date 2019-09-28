import { OnMessageState } from "../state";
import { AbstractCommand, ExecutableCommand } from "../command";

import { NikkuException } from "./NikkuException";

export class CommandException extends NikkuException {

    private state: OnMessageState;

    /**
     * @classdesc Exception thrown when a command is executed without the appropriate access level.
     * @param message - Message associated with the error.
     */
    constructor(state: OnMessageState, command: AbstractCommand) {
        if (command instanceof ExecutableCommand) {
            super(`Exception occurred during execution of "${command.getCommandString()}"`);
        }
        this.state = state;
    }

    protected toExecutionUser(message: string): void {
        this.state.getHandle().reply(message);
    }
}
