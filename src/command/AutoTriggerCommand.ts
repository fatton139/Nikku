import { ICommand } from "../command/ICommand";
import { Command } from "../command/Command";
import { FortniteBotAction } from "action/FortniteBotAction";
import { FortniteBotTrigger } from "action/FortniteBotTrigger";
import { fortniteBotCore as activeCore } from "../../fortniteBot";

export class AutoTriggerCommand extends Command implements ICommand {
    /**
     * The condition required to execute the action.
     */
    public trigger: FortniteBotTrigger;

    /**
     * @classdesc Commands which are triggered without user directly calling it.
     * @param accessLevel - The required access level to execute this command.
     * @param action - The action to execute.
     * @param trigger - The condition required to execute the action.
     */
    public constructor(accessLevel: number,
                       action: FortniteBotAction, trigger: FortniteBotTrigger) {
        super(null, accessLevel, action);
        this.trigger = trigger;
    }

    /**
     * Attempt to execute the trigger.
     * @returns true if conditions of the trigger has been met.
     */
    public tryTrigger(): boolean {
        return this.trigger.execute(activeCore.getCoreState());
    }
}
