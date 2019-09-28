import { OnMessageState } from "../state";
import { AbstractCommand } from "../command";
import { AccessLevel } from "../user";

import { CommandException } from "./CommandException";

// import DBUserSchema from "../database/schemas/DBUserSchema";

export class UnauthorizedExecutionException extends CommandException {

    /**
     * @classdesc Exception thrown when a command is executed without the appropriate access level.
     * @param message - Message associated with the error.
     */
    constructor(state: OnMessageState, command: AbstractCommand, user: any | undefined) {
        super(state, command);
        if (user && user.accessLevel) {
            this.toExecutionUser(
                "You do not have the required access level to this command.\n" +
                `Your access level: **${user.accessLevel}** (${AccessLevel[user.accessLevel]})\n` +
                `Command access level: **${command.getAccessLevel()}** (${AccessLevel[command.getAccessLevel()]})\n`,
            );
        }
    }
}
