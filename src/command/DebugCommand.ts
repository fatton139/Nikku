import { ICommand } from "./ICommand";
import { ExecutableCommand } from "./ExecutableCommand";
import { FortniteBotAction } from "action/FortniteBotAction";

export class DebugCommand extends ExecutableCommand implements ICommand {
    public constructor(commandString: string, action: FortniteBotAction) {
        super(commandString, 3, action);
    }
}
