import { ICommand } from "../command/ICommand";
import { User } from "../user/User";
import { UnauthorizedCommandException } from "../exceptions/UnauthorizedCommandException";
import { FortniteBotAction } from "../action/FortniteBotAction";

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
            throw new UnauthorizedCommandException("Unauthorized Execution of" +
                "Command");
        }
        if (!this.args) {
            this.args = [];
        }
        this.action.execute(this.args);
    }
}
