import { ExecutableCommand } from "./ExecutableCommand";
import { ICommand } from "./ICommand";
import { User } from "../user/User";
import { FortniteBotAction } from "../action/Action";
import { PendingResponseState } from "../state/PendingResponseState";
import { core } from "core/NikkuCore";

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
        // core.changeCoreState(new PendingResponseState(undefined));
        super.executeAction(user);
    }
}
