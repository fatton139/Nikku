import NikkuException from "./NikkuException";
import CoreState from "state/CoreState";
import { DBUserSchema as User } from "database/schemas/DBUserSchema";
import { Command } from "command/Command";
import { AccessLevel } from "user/AccessLevel";

export default class UnauthorizedCommandException extends NikkuException {

    /**
     * @classdesc Exception thrown when a command is executed without the appropriate access level.
     * @param message - Message associated with the error.
     */
    constructor(state: CoreState, command: Command, user: User) {
        const message = `Unauthorized execution of "${command.getCommandString()}"`;
        super(state, message);
        state.getMessageHandle().reply(
            "You do not have the required access level to this command.\n" +
            `Your access level: **${user.getAccessLevel()}** (${AccessLevel[user.getAccessLevel()]})\n` +
            `Command access level: **${command.getAccessLevel()}** (${AccessLevel[command.getAccessLevel()]})\n`,
        );
    }
}
