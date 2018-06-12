import { ICommand } from "./ICommand";
import { ExecutableCommand } from "./ExecutableCommand";
import { FortniteBotAction } from "action/FortniteBotAction";

export class DebugCommand extends ExecutableCommand implements ICommand {
    public constructor(commandString: string, args: string[],
                       action: FortniteBotAction) {
        super(commandString, args, 3, action);
    }
}
