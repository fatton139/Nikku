import { ExecutableCommand } from "./ExecutableCommand";
import { ICommand } from "./ICommand";
import { User } from "../user/User";
import { FortniteBotAction } from "../action/FortniteBotAction";
import { PendingResponseState } from "../state/PendingResponseState";
import { fortniteBotCore as activeCore } from "../../fortniteBot";

export class RequireResponseCommand
extends ExecutableCommand implements ICommand {
    public constructor(commandString: string, accessLevel: number,
                       action: FortniteBotAction) {
        super(commandString, accessLevel, action);
    }
    public executeAction(user: User): void {
        activeCore.changeCoreState(new PendingResponseState(null));
        super.executeAction(user);
    }
}
