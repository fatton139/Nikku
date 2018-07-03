import { ICommand } from "../command/ICommand";
import { Command } from "../command/Command";
import { FortniteBotAction } from "../action/FortniteBotAction";

/**
 * Commands which must be executed by a user to run.
 */

export class ExecutableCommand extends Command implements ICommand {
    public constructor(commandString: string, accessLevel: number,
                       action: FortniteBotAction) {
        super(commandString, accessLevel, action);
    }
}
