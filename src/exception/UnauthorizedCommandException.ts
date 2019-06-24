import * as Discord from "discord.js";
import { NikkuException } from "exception";
import CoreState from "state/CoreState";
import DBUserSchema from "database/schemas/DBUserSchema";
import Command from "command/AbstractCommand";
import { AccessLevel } from "user/AccessLevel";

export default class UnauthorizedCommandException extends NikkuException {

    /**
     * @classdesc Exception thrown when a command is executed without the appropriate access level.
     * @param message - Message associated with the error.
     */
    constructor(state: CoreState<Discord.Message>, command: Command, user: DBUserSchema) {
        const message = `Unauthorized execution of "${command.getCommandString()}"`;
        super(message);
        if (user && user.accessLevel) {
            state.getHandle().reply(
                "You do not have the required access level to this command.\n" +
                `Your access level: **${user.accessLevel}** (${AccessLevel[user.accessLevel]})\n` +
                `Command access level: **${command.getAccessLevel()}** (${AccessLevel[command.getAccessLevel()]})\n`,
            );
        }
    }
}
