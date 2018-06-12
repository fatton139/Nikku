import { ICommand } from "../command/ICommand";
import { Command } from "../command/Command";
import { FortniteBotAction } from "action/FortniteBotAction";
import { FortniteBotTrigger } from "action/FortniteBotTrigger";

/**
 * Commands which are auto triggered.
 */

export class AutoTriggerCommand extends Command implements ICommand {
    public name: string;
    public trigger: FortniteBotTrigger;
    public constructor(name: string, accessLevel: number,
                       action: FortniteBotAction, trigger: FortniteBotTrigger) {
        super(null, null, accessLevel, action);
        this.name = name;
        this.trigger = trigger;
    }
    public tryTrigger(): boolean {
        return this.trigger.execute();
    }
}
