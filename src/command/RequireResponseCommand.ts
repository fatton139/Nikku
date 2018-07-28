import { ExecutableCommand } from "./ExecutableCommand";
import { ICommand } from "./ICommand";
import { User } from "../user/User";
import { FortniteBotAction } from "../action/FortniteBotAction";
import { PendingResponseState } from "../state/PendingResponseState";
import { fortniteBotCore as activeCore } from "../../fortniteBot";

export class RequireResponseCommand
extends ExecutableCommand implements ICommand {
    /**
     * @classdesc Commands which require a user response.
     * @param commandString - The string required to execute this command.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     */
    public constructor(commandString: string, accessLevel: number,
                       action: FortniteBotAction) {
        super(commandString, accessLevel, action);
    }

    /**
     * Execute the action provided by this command. Changes the core state.
     * @param user - The user attempting to execute this command.
     */
    public executeAction(user: User): void {
        activeCore.changeCoreState(new PendingResponseState(null));
        super.executeAction(user);
    }
}
