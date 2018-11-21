import * as Discord from "discord.js";
import { ICommand } from "command/ICommand";
import { User } from "user/User";
import { UnauthorizedCommandException } from "exceptions/UnauthorizedCommandException";
import Action from "action/Action";
import { FortniteBotException } from "exceptions/FortniteBotException";
import { core } from "core/NikkuCore";

export class Command implements ICommand {
    /**
     * The string required to execute this command.
     */
    public readonly commandString?: string;

    /**
     * The required access level to execute this command.
     */
    public readonly accessLevel: number;

    /**
     * An action to execute.
     */
    public readonly action: Action;

    /**
     * Arguments to execute the action with.
     */
    public args: string[];

    public isEnabled: boolean;

    /**
     * @classdesc Base command class for the bot.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(commandString: string, accessLevel: number,
                       action: Action) {
        this.action = action;
        this.accessLevel = accessLevel;
        this.commandString = commandString;
    }

    /**
     * Changes the arguments of the command.
     * @param args - New arguments for the command.
     */
    public setArgs(args: string[]): void {
        this.args = args;
    }

    /**
     * Execute the action provided by this command.
     * @param user - The user attempting to execute this command.
     */
    public executeAction(user: User): void {
        if (user.accessLevel < this.accessLevel) {
            const m = core.getCoreState().getHandle() as Discord.Message;
            m.reply(
                "You do not have the required access level to this command.\n" +
                "Your access level: **" + user.accessLevel + "**\n" +
                "Command access level: **" + this.accessLevel + "**");
            throw new UnauthorizedCommandException("Unauthorized Execution of " +
                "Command of " + this.commandString);
        }
        if (!this.args) {
            this.args = [];
        }
        if (!this.action.execute(core.getCoreState(), this.args)) {
            throw new FortniteBotException("Failed Execution");
        }
    }

    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }
}
