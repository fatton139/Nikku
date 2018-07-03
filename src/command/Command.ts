import * as Discord from "discord.js";
import { ICommand } from "../command/ICommand";
import { User } from "../user/User";
import { UnauthorizedCommandException } from "../exceptions/UnauthorizedCommandException";
import { FortniteBotAction } from "../action/FortniteBotAction";
import { FortniteBotException } from "../exceptions/FortniteBotException";
import { fortniteBotCore } from "../../fortniteBot";
import { fortniteBotCore as activeCore } from "../../fortniteBot";

export class Command implements ICommand {
    public commandString?: string;
    public readonly accessLevel: number;
    public action: FortniteBotAction;
    public args: string[];
    public constructor(commandString: string, accessLevel: number,
                       action: FortniteBotAction) {
        this.action = action;
        this.accessLevel = accessLevel;
        this.commandString = commandString;
    }
    public setArgs(args: string[]): void {
        this.args = args;
    }
    public executeAction(user: User): void {

        if (user.accessLevel < this.accessLevel) {
            const m = activeCore.getCoreState().getHandle() as Discord.Message;
            m.reply(
                "You do not have the required access level to this command.\n" +
                "Your access level: **" + user.accessLevel + "**\n" +
                "Command access level: **" + this.accessLevel + "**"
            );
            throw new UnauthorizedCommandException("Unauthorized Execution of " +
                "Command of " + this.commandString);
        }
        if (!this.args) {
            this.args = [];
        }
        if (!this.action.execute(fortniteBotCore.getCoreState(), this.args)) {
            throw new FortniteBotException("Failed Execution");
        }
    }
}
