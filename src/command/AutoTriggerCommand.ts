import { ICommand } from "../command/ICommand";
import { Command } from "../command/Command";
import { FortniteBotAction } from "action/FortniteBotAction";
import { FortniteBotTrigger } from "action/FortniteBotTrigger";
import { fortniteBotCore as activeCore } from "../../fortniteBot";

/**
 * Commands which are auto triggered.
 */

export class AutoTriggerCommand extends Command implements ICommand {
    public trigger: FortniteBotTrigger;
    public constructor(accessLevel: number,
                       action: FortniteBotAction, trigger: FortniteBotTrigger) {
        super(null, accessLevel, action);
        this.trigger = trigger;
    }
    public tryTrigger(): boolean {
        return this.trigger.execute(activeCore.getCoreState());
    }
}
