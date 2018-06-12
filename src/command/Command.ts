import { ICommand } from "../command/ICommand";
import { User } from "../user/User";
import { UnauthorizedCommandException } from "../exceptions/UnauthorizedCommandException";

export class Command implements ICommand {
    public commandString?: string;
    public readonly accessLevel: number;
    public action: () => boolean;
    public constructor(commandString: string, accessLevel: number,
                       action: () => boolean) {
        this.action = action;
        this.accessLevel = accessLevel;
        this.commandString = commandString;
    }
    public executeAction(user: User): void {
        if (user.accessLevel < this.accessLevel) {
            throw new UnauthorizedCommandException("Unauthorized Execution of" +
                "Command");
        }
        this.action();
    }
}
