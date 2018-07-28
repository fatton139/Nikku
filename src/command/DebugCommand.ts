import { ICommand } from "./ICommand";
import { ExecutableCommand } from "./ExecutableCommand";
import { FortniteBotAction } from "action/FortniteBotAction";

export class DebugCommand extends ExecutableCommand implements ICommand {

    /**
     * @classdesc Debug commands for testing purposes.
     * @param commandString - The string required to execute this command.
     * @param action - The action to execute.
     */
    public constructor(commandString: string, action: FortniteBotAction) {
        super(commandString, 3, action);
    }
}
